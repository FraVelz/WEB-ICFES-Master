export interface AuthUser {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  profileImage: string | null;
}

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAccountAuth: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<AuthUser | null>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  loginWithGoogle: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  verifyEmailExists: () => Promise<boolean>;
  getUserData: (uid: string) => Promise<Record<string, unknown>>;
};

export interface SupabaseUserLike {
  id: string;
  email?: string | null;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
}
