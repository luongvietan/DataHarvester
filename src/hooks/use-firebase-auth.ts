import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import { useApiError } from "./use-api-error";

export type AuthUser = User | null;

export function useFirebaseAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useApiError();

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Gửi email xác thực
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      return userCredential.user;
    } catch (err) {
      handleError(err, "Không thể tạo tài khoản");
      setError("Không thể tạo tài khoản");
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err) {
      handleError(err, "Đăng nhập không thành công");
      setError("Đăng nhập không thành công");
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      handleError(err, "Không thể đăng xuất");
      setError("Không thể đăng xuất");
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleError(err, "Không thể gửi email đặt lại mật khẩu");
      setError("Không thể gửi email đặt lại mật khẩu");
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
