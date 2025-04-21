import { createContext, useContext, ReactNode } from "react";
import { useFirebaseAuth, AuthUser } from "@/hooks/use-firebase-auth";
import { User } from "firebase/auth";

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  error: string | null;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  updateUserEmail: (newEmail: string, password: string) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  getUserSettings: () => Promise<Record<string, unknown> | null>;
  updateUserSettings: (settings: Record<string, unknown>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
