export interface AuthUser {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface PlanData {
  planType?: string;
  plan_type?: string;
  planName?: string;
  plan_name?: string;
  status?: string;
  features?: Record<string, unknown>;
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
  getUserPlan: () => Promise<Record<string, unknown>>;
  updateUserPlan: (uid: string, planData: PlanData) => Promise<void>;
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
