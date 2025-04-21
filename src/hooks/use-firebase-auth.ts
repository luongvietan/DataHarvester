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
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { useApiError } from "./use-api-error";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Cập nhật tên hiển thị
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });

        // Tạo hồ sơ người dùng trong Firestore
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          userId: userCredential.user.uid,
          email: email,
          name: displayName,
          subscriptionStatus: "free",
          themePreference: "light", // Mặc định theme sáng
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        // Gửi email xác thực
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

      // Cập nhật thời gian đăng nhập trong Firestore
      if (userCredential.user) {
        const userDocRef = doc(db, "users", userCredential.user.uid);

        // Kiểm tra xem tài liệu người dùng đã tồn tại chưa
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Tạo tài liệu người dùng nếu nó không tồn tại
          await setDoc(userDocRef, {
            userId: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || email.split("@")[0],
            subscriptionStatus: "free",
            themePreference: "light",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        } else {
          // Cập nhật thời gian đăng nhập nếu tài liệu đã tồn tại
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp(),
          });
        }
      }

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

  const resendVerificationEmail = async () => {
    setError(null);
    if (!user) {
      setError("Không có người dùng đăng nhập");
      return;
    }

    try {
      await sendEmailVerification(user);
    } catch (err) {
      handleError(err, "Không thể gửi lại email xác thực");
      setError("Không thể gửi lại email xác thực");
      throw err;
    }
  };

  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    setError(null);
    if (!user) {
      setError("Không có người dùng đăng nhập");
      return;
    }

    try {
      await updateProfile(user, data);

      // Cập nhật thông tin trong Firestore
      const userDocRef = doc(db, "users", user.uid);
      if (data.displayName) {
        await updateDoc(userDocRef, {
          name: data.displayName,
        });
      }

      // Cập nhật đối tượng người dùng
      setUser({ ...user });
    } catch (err) {
      handleError(err, "Không thể cập nhật hồ sơ");
      setError("Không thể cập nhật hồ sơ");
      throw err;
    }
  };

  const updateUserEmail = async (newEmail: string, password: string) => {
    setError(null);
    if (!user) {
      setError("Không có người dùng đăng nhập");
      return;
    }

    try {
      // Xác thực lại người dùng trước khi thay đổi email
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);

      // Gửi email xác thực trước khi cập nhật email
      await verifyBeforeUpdateEmail(user, newEmail);

      // Cập nhật email trong Firestore (sẽ được thực hiện sau khi xác thực email mới)
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        email: newEmail,
      });
    } catch (err) {
      handleError(err, "Không thể cập nhật email");
      setError("Không thể cập nhật email");
      throw err;
    }
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setError(null);
    if (!user) {
      setError("Không có người dùng đăng nhập");
      return;
    }

    try {
      // Xác thực lại người dùng trước khi thay đổi mật khẩu
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Cập nhật mật khẩu
      await updatePassword(user, newPassword);
    } catch (err) {
      handleError(err, "Không thể cập nhật mật khẩu");
      setError("Không thể cập nhật mật khẩu");
      throw err;
    }
  };

  const getUserSettings = async () => {
    if (!user) return null;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (err) {
      handleError(err, "Không thể lấy cài đặt người dùng");
      return null;
    }
  };

  const updateUserSettings = async (settings: Record<string, unknown>) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, settings);
    } catch (err) {
      handleError(err, "Không thể cập nhật cài đặt người dùng");
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
    resendVerificationEmail,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    getUserSettings,
    updateUserSettings,
  };
}
