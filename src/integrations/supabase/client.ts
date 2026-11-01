import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Local storage keys for live in-app Supabase configuration
const STORAGE_URL_KEY = 'nexora_supabase_url';
const STORAGE_ANON_KEY = 'nexora_supabase_anon_key';

export function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Strip trailing /rest/v1, /rest/v1/, or any trailing slashes
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) || '' : '';

  const rawUrl = localUrl.trim() || envUrl.trim();
  const activeUrl = sanitizeSupabaseUrl(rawUrl);
  const activeKey = localKey.trim() || envKey.trim();

  const isValidUrl = activeUrl.startsWith('http://') || activeUrl.startsWith('https://');
  const isConfigured = Boolean(isValidUrl && activeKey && activeKey.length > 20);

  return {
    url: activeUrl,
    anonKey: activeKey,
    isConfigured,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    const cleaned = sanitizeSupabaseUrl(url);
    if (cleaned) localStorage.setItem(STORAGE_URL_KEY, cleaned);
    else localStorage.removeItem(STORAGE_URL_KEY);

    if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_ANON_KEY);

    // Reset client instance so it recreates with new credentials
    supabaseInstance = null;
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(creds.url, creds.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export interface DatabaseDiagnosticResult {
  isConfigured: boolean;
  url: string;
  authConnected: boolean;
  restConnected: boolean;
  schemaReady: boolean;
  status: 'ready' | 'migration_needed' | 'auth_only' | 'unreachable' | 'not_configured';
  message: string;
  missingTables?: string[];
}

export async function testDatabaseConnectivity(): Promise<DatabaseDiagnosticResult> {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) {
    return {
      isConfigured: false,
      url: '',
      authConnected: false,
      restConnected: false,
      schemaReady: false,
      status: 'not_configured',
      message: 'No Supabase URL or Anon Key configured. NEXORA is running in high-fidelity local reactive persistence mode.',
    };
  }

  const result: DatabaseDiagnosticResult = {
    isConfigured: true,
    url: creds.url,
    authConnected: false,
    restConnected: false,
    schemaReady: false,
    status: 'unreachable',
    message: '',
  };

  // 1. Test Auth Endpoint (GoTrue)
  try {
    const authRes = await fetch(`${creds.url}/auth/v1/health`, {
      headers: {
        apikey: creds.anonKey,
      },
    });
    if (authRes.ok) {
      result.authConnected = true;
    }
  } catch (err) {
    console.warn('Auth health check failed:', err);
  }

  // 2. Test PostgREST and tables
  try {
    const tablesToCheck = ['departments', 'profiles', 'notices'];
    const missing: string[] = [];

    for (const table of tablesToCheck) {
      const res = await fetch(`${creds.url}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          apikey: creds.anonKey,
          Authorization: `Bearer ${creds.anonKey}`,
        },
      });

      if (res.ok) {
        result.restConnected = true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (errorData?.code === 'PGRST205' || res.status === 404) {
          missing.push(table);
        }
      }
    }

    if (missing.length === 0 && result.restConnected) {
      result.schemaReady = true;
      result.status = 'ready';
      result.message = 'Supabase PostgreSQL database and Auth are fully connected and tables are verified ready!';
    } else if (missing.length > 0) {
      result.schemaReady = false;
      result.missingTables = missing;
      result.status = 'migration_needed';
      result.message = `Connected to Supabase project, but tables (${missing.join(', ')}) were not found. You need to run the SQL migration in your Supabase SQL Editor.`;
    } else if (result.authConnected) {
      result.status = 'auth_only';
      result.message = 'Supabase Auth server is reachable, but PostgREST endpoint returned an unexpected response.';
    }
  } catch (err: any) {
    result.status = 'unreachable';
    result.message = `Could not reach ${creds.url}. Check network, CORS, or URL spelling. Error: ${err?.message || 'Failed to fetch'}`;
  }

  return result;
}
