/**
 * PUBLIC_INTERFACE
 * context barrel: single source of truth for AuthProvider and hooks.
 * All components must import from 'src/context' to avoid mismatched contexts.
 *
 * IMPORTANT:
 * - Export strictly from the canonical TSX AuthContext to avoid duplicate contexts between .jsx and .tsx.
 * - Do not re-export from AuthContext.jsx to prevent accidental mismatches that lead to white screens.
 */
export { AuthProvider, useSupabaseAuth, useAuth, useRole } from './AuthContext.tsx';
