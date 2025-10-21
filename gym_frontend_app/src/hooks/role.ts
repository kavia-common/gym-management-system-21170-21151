import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * useIsTrainer: Returns boolean if current role is 'trainer'.
 */
export function useIsTrainer(): boolean {
  const { role } = useSupabaseAuth();
  return role === 'trainer';
}

/**
 * PUBLIC_INTERFACE
 * useIsMember: Returns boolean if current role is 'member'.
 */
export function useIsMember(): boolean {
  const { role } = useSupabaseAuth();
  return role === 'member';
}

/**
 * PUBLIC_INTERFACE
 * useIsAdmin: Returns boolean if current role is 'admin'.
 */
export function useIsAdmin(): boolean {
  const { role } = useSupabaseAuth();
  return role === 'admin';
}
