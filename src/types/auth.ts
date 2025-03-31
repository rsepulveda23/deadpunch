
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  email: string;
  password: string;
  adminAccountExists: boolean | null;
  isAdminEmailAuthorized: boolean;
}

export interface UseAuthReturn extends AuthState {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}
