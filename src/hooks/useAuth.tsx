
import { useState } from 'react';
import { AuthState, UseAuthReturn } from '@/types/auth';
import { useSession } from '@/hooks/useSession';
import { useSignIn } from '@/hooks/useSignIn';
import { useSignUp } from '@/hooks/useSignUp';

// Use "export type" instead of just "export" for types when isolatedModules is enabled
export type { AuthState } from '@/types/auth';

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    email: '',
    password: '',
    adminAccountExists: null,
    isAdminEmailAuthorized: true
  });

  // Get admin account status from session hook
  const { adminAccountExists } = useSession();
  
  // Update our local state when session info is available
  if (adminAccountExists !== null && state.adminAccountExists !== adminAccountExists) {
    setState(prevState => ({ ...prevState, adminAccountExists }));
  }

  const updateState = (newState: Partial<AuthState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const setLoading = (isLoading: boolean) => updateState({ isLoading });
  const setEmail = (email: string) => updateState({ email });
  const setPassword = (password: string) => updateState({ password });

  // Set up sign in and sign up handlers
  const { handleSignIn } = useSignIn(state.email, state.password, setLoading);
  const { handleSignUp } = useSignUp(state.email, state.password, setLoading);

  return {
    ...state,
    setEmail,
    setPassword,
    handleSignIn,
    handleSignUp
  };
};
