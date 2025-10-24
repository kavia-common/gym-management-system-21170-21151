/**
 * PUBLIC_INTERFACE
 * context barrel: single source of truth for AuthProvider and hooks.
 * All components must import from 'src/context' to avoid mismatched contexts.
 */
export { AuthProvider, useSupabaseAuth, useAuth, useRole } from './AuthContext.tsx';
