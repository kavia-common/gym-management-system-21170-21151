declare module '@supabase/supabase-js' {
  export interface SupabaseAuthOptions {
    persistSession?: boolean;
    autoRefreshToken?: boolean;
    detectSessionInUrl?: boolean;
  }
  export interface SupabaseClientOptions {
    auth?: SupabaseAuthOptions;
  }
  export interface SupabaseClient {
    // Minimal surface used by this app; real package provides full types.
    auth: any;
    from: (table: string) => any;
    rpc: (fn: string, params?: Record<string, any>) => any;
    storage?: any;
  }
  export function createClient<TDatabase = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions
  ): SupabaseClient;
}
