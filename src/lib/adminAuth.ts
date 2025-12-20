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
  // Create SSR client that reads from cookies
  const supabase = createSupabaseServerClient(Astro.cookies, Astro.request);

  // Debug: Check if there are any cookies at all
  const cookieHeader = Astro.request.headers.get('cookie');
  const hasCookies = !!cookieHeader && cookieHeader.includes('sb-');
  console.log('Auth check - cookies present:', hasCookies, { 
    cookieHeader: cookieHeader ? 'present' : 'missing',
    url: Astro.url.pathname 
  });

  // Use getUser() - validates session with Supabase Auth server (more secure than getSession)
  const { data: { user }, error } = await supabase.auth.getUser();

  console.log('getUser result:', {
    hasError: !!error,
    errorMessage: error?.message,
    hasUser: !!user,
    userId: user?.id
  });

  if (error || !user) {
    console.log('No user session - redirecting to login');
    return null;
  }

  // Check if user is admin using the SSR client (which has session context for RLS)
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (adminError || !adminUser) {
    console.log('User is not admin:', { userId: user.id, error: adminError?.message });
    return null;
  }

  console.log('Admin session valid:', { userId: user.id, role: adminUser.role });
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
}

/**
 * Redirect to login if not authenticated as admin
 */
export async function requireAdmin(Astro: AstroGlobal): Promise<AdminSession> {
  console.log('requireAdmin called for:', Astro.url.pathname);
  const session = await getAdminSession(Astro);
  
  if (!session) {
    console.log('No admin session - redirecting to /admin/login');
    return Astro.redirect('/admin/login') as never;
  }

  console.log('Admin session found, allowing access');
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

