import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Try import.meta.env first (Astro), fallback to process.env (serverless runtime)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Admin features will not work.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);

// Types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type UserSession = Database['public']['Tables']['user_sessions']['Row'];

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'moderator' | 'admin' | 'super_admin';
  created_at: string;
  created_by: string | null;
}

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  return !error && !!data;
}

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return null;
  return data as AdminUser;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const [
    { count: totalUsers },
    { count: totalMatches },
    { count: pendingReports },
    { data: activeToday }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('user_sessions')
      .select('user_id')
      .gte('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  ]);

  const uniqueActiveUsers = new Set(activeToday?.map(s => s.user_id) || []).size;

  return {
    totalUsers: totalUsers || 0,
    activeToday: uniqueActiveUsers,
    totalMatches: totalMatches || 0,
    pendingReports: pendingReports || 0
  };
}

// ============================================
// USERS
// ============================================

export async function getUsers(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
} = {}) {
  const { page = 1, limit = 10, search, sortBy = 'created_at' } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,gamertag.ilike.%${search}%`);
  }

  // Sort
  if (sortBy === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sortBy === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else if (sortBy === 'name') {
    query = query.order('name', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }

  // Get report counts for each user
  const userIds = data?.map(u => u.id) || [];
  const { data: reportCounts } = await supabase
    .from('reports')
    .select('reported_user_id')
    .in('reported_user_id', userIds);

  const reportCountMap: Record<string, number> = {};
  reportCounts?.forEach(r => {
    reportCountMap[r.reported_user_id] = (reportCountMap[r.reported_user_id] || 0) + 1;
  });

  const usersWithReports = data?.map(user => ({
    ...user,
    reportCount: reportCountMap[user.id] || 0
  })) || [];

  return { users: usersWithReports, total: count || 0 };
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// ============================================
// REPORTS
// ============================================

export async function getReports(options: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
} = {}) {
  const { page = 1, limit = 10, status, type } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (type) {
    query = query.eq('reason', type);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching reports:', error);
    return { reports: [], total: 0 };
  }

  // Get user profiles for reported users and reporters
  const userIds = new Set<string>();
  data?.forEach(r => {
    userIds.add(r.reported_user_id);
    userIds.add(r.reporter_id);
  });

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email, gamertag, avatar, created_at')
    .in('id', Array.from(userIds));

  const profileMap: Record<string, Profile> = {};
  profiles?.forEach(p => {
    profileMap[p.id] = p as Profile;
  });

  const reportsWithUsers = data?.map(report => ({
    ...report,
    reportedUser: profileMap[report.reported_user_id] || null,
    reporter: profileMap[report.reporter_id] || null
  })) || [];

  return { reports: reportsWithUsers, total: count || 0 };
}

export async function getReportById(reportId: string) {
  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error || !report) {
    console.error('Error fetching report:', error);
    return null;
  }

  // Get profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', [report.reported_user_id, report.reporter_id]);

  const profileMap: Record<string, Profile> = {};
  profiles?.forEach(p => {
    profileMap[p.id] = p;
  });

  // Get report count for reported user
  const { count: reportCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('reported_user_id', report.reported_user_id);

  return {
    ...report,
    reportedUser: profileMap[report.reported_user_id] || null,
    reporter: profileMap[report.reporter_id] || null,
    reportedUserReportCount: reportCount || 0
  };
}

export async function updateReportStatus(
  reportId: string, 
  status: string, 
  actionTaken: string | null,
  adminNotes: string | null,
  reviewedBy: string
) {
  const { error } = await supabase
    .from('reports')
    .update({
      status,
      action_taken: actionTaken,
      admin_notes: adminNotes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy
    })
    .eq('id', reportId);

  return !error;
}

// ============================================
// RECENT ACTIVITY
// ============================================

export async function getRecentActivity(limit = 10) {
  const activities: Array<{
    type: string;
    description: string;
    time: string;
    userId?: string;
  }> = [];

  // Get recent signups
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  recentUsers?.forEach(user => {
    activities.push({
      type: 'signup',
      description: `${user.name || 'New user'} signed up`,
      time: user.created_at || '',
      userId: user.id
    });
  });

  // Get recent matches
  const { data: recentMatches } = await supabase
    .from('matches')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  recentMatches?.forEach(match => {
    activities.push({
      type: 'match',
      description: 'New squad match created',
      time: match.created_at || ''
    });
  });

  // Get recent reports
  const { data: recentReports } = await supabase
    .from('reports')
    .select('id, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  recentReports?.forEach(report => {
    activities.push({
      type: 'report',
      description: `Report submitted: ${report.reason}`,
      time: report.created_at || ''
    });
  });

  // Sort by time and return top N
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
}

// ============================================
// REPORT STATS
// ============================================

export async function getReportStats() {
  const [
    { count: pending },
    { count: reviewing },
    { count: resolved },
    { count: dismissed }
  ] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'reviewing'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'dismissed')
  ]);

  return {
    pending: pending || 0,
    reviewing: reviewing || 0,
    resolved: resolved || 0,
    dismissed: dismissed || 0
  };
}
