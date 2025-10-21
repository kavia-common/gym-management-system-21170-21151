import { getSupabaseClient } from '../lib/supabaseClient';
import { getURL } from './getURL';

/**
 * PUBLIC_INTERFACE
 * signInWithOAuth: Generic OAuth sign-in using Supabase.
 */
export const signInWithOAuth = async (provider) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

/**
 * PUBLIC_INTERFACE
 * signInWithGoogle: Convenience wrapper to sign in with Google.
 */
export const signInWithGoogle = async () => {
  return signInWithOAuth('google');
};

/**
 * PUBLIC_INTERFACE
 * signUp: Email/password signup via Supabase.
 */
export const signUp = async (email, password) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

/**
 * PUBLIC_INTERFACE
 * resetPassword: Sends a reset password email using Supabase.
 */
export const resetPassword = async (email) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}auth/reset-password`,
  });
  return { data, error };
};
