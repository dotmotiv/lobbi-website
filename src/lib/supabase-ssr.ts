import { createServerClient, createBrowserClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Get the project ref from URL for cookie naming
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1] || 'sb';

/**
 * Create a Supabase client for server-side use (Astro pages/API routes)
 */
export function createSupabaseServerClient(cookies: AstroCookies, request?: Request) {
  return createServerClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      cookies: {
        getAll() {
          // Astro cookies doesn't have getAll(), so we parse the cookie header from the request
          const allCookies: { name: string; value: string }[] = [];
          
          // Get cookies from request header if available
          if (request) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
              cookieHeader.split(';').forEach((cookie: string) => {
                const [name, ...valueParts] = cookie.trim().split('=');
                const cookieName = name.trim();
                if (cookieName.startsWith('sb-')) {
                  allCookies.push({ 
                    name: cookieName, 
                    value: valueParts.join('=') 
                  });
                }
              });
            }
          }
          
          // Also check individual cookies using Astro's get() method as fallback
          // This handles cases where cookies might be set via Astro's cookie API
          const cookieNames = [
            `sb-${projectRef}-auth-token`,
            `sb-${projectRef}-auth-token.0`,
            `sb-${projectRef}-auth-token.1`,
            `sb-${projectRef}-auth-token-code-verifier`,
          ];
          
          cookieNames.forEach(cookieName => {
            const cookie = cookies.get(cookieName);
            if (cookie?.value) {
              // Only add if not already in allCookies (avoid duplicates)
              if (!allCookies.find(c => c.name === cookieName)) {
                allCookies.push({ name: cookieName, value: cookie.value });
              }
            }
          });
          
          return allCookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, {
              path: options?.path || '/',
              httpOnly: options?.httpOnly ?? true,
              secure: import.meta.env.PROD,
              sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') || 'lax',
              maxAge: options?.maxAge,
            });
          });
        },
      },
    }
  );
}

/**
 * Create a Supabase client for browser-side use with cookie storage
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      cookies: {
        getAll() {
          // Parse document.cookie
          return document.cookie.split(';').map(c => {
            const [name, ...valueParts] = c.trim().split('=');
            return { name, value: valueParts.join('=') };
          }).filter(c => c.name.startsWith('sb-'));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookie = `${name}=${value}`;
            if (options?.path) cookie += `; path=${options.path}`;
            if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
            if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
            if (import.meta.env?.PROD) cookie += '; secure';
            document.cookie = cookie;
          });
        },
      },
    }
  );
}

