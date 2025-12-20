import { createSupabaseServerClient } from './supabase-ssr';
import type { AstroGlobal } from 'astro';

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  admin: {
    id: string;
    role: 'moderator' | 'admin' | 'super_admin';
  };
}

/**
 * Check if the current request has a valid admin session
 * Returns the admin session if valid, null otherwise
 */
export async function getAdminSession(Astro: AstroGlobal): Promise<AdminSession | null> {
  try {
    // Check if environment variables are set
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not set');
      return null; // Fail gracefully
    }

    // Create SSR client that reads from cookies
    const supabase = createSupabaseServerClient(Astro.cookies, Astro.request);

    // Use getUser() - validates session with Supabase Auth server (more secure than getSession)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Check if user is admin using the SSR client (which has session context for RLS)
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminUser) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email || ''
      },
      admin: {
        id: adminUser.id,
        role: adminUser.role
      }
    };
  } catch (error) {
    console.error('Error in getAdminSession:', error);
    return null; // Fail gracefully - will redirect to login
  }
}

/**
 * Redirect to login if not authenticated as admin
 */
export async function requireAdmin(Astro: AstroGlobal): Promise<AdminSession> {
  const session = await getAdminSession(Astro);
  
  if (!session) {
    return Astro.redirect('/admin/login') as never;
  }

  return session;
}

/**
 * Check if user has required role
 */
export function hasRole(
  session: AdminSession, 
  requiredRole: 'moderator' | 'admin' | 'super_admin'
): boolean {
  const roleHierarchy = {
    'moderator': 1,
    'admin': 2,
    'super_admin': 3
  };

  return roleHierarchy[session.admin.role] >= roleHierarchy[requiredRole];
}

