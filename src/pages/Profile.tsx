import { useState, FormEvent, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Key,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check,
  Loader2,
  Moon,
  Sun,
  Shield,
  Bell,
  Lock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import {
  getAuth,
  updatePassword,
  updateEmail,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Profile = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const auth = getAuth();

  // User info state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preference state
  const [preferences, setPreferences] = useState({
    darkMode: document.documentElement.classList.contains("dark"),
    emailNotifications: true,
  });

  // UI states
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");

  // Email regex pattern
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Load user preferences from localStorage or Firestore
  useEffect(() => {
    // In a real app, we would load these from Firestore
    const loadPreferences = async () => {
      try {
        // For demo, we'll just use localStorage for dark mode
        const isDarkMode = document.documentElement.classList.contains("dark");

        setPreferences((prev) => ({
          ...prev,
          darkMode: isDarkMode,
        }));

        // In a complete implementation, we would load from Firestore
        // if (user) {
        //   const userDocRef = doc(db, "users", user.uid);
        //   const userDoc = await getDoc(userDocRef);
        //   if (userDoc.exists()) {
        //     const userData = userDoc.data();
        //     setPreferences({
        //       darkMode: userData.darkMode || false,
        //       emailNotifications: userData.emailNotifications || true,
        //     });
        //   }
        // }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, [user]);

  // Handle profile data change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password data change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !preferences.darkMode;
    setPreferences((prev) => ({ ...prev, darkMode: newDarkMode }));

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // In a real app, we would save this to Firestore
    // if (user) {
    //   const userDocRef = doc(db, "users", user.uid);
    //   updateDoc(userDocRef, {
    //     darkMode: newDarkMode
    //   });
    // }
  };

  // Toggle email notifications
  const toggleEmailNotifications = () => {
    const newValue = !preferences.emailNotifications;
    setPreferences((prev) => ({ ...prev, emailNotifications: newValue }));

    // In a real app, we would save this to Firestore
    // if (user) {
    //   const userDocRef = doc(db, "users", user.uid);
    //   updateDoc(userDocRef, {
    //     emailNotifications: newValue
    //   });
    // }
  };

  // Update profile information
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!profileData.displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    if (!EMAIL_REGEX.test(profileData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsProfileUpdating(true);

    try {
      if (user) {
        // Update display name
        await updateProfile(user, {
          displayName: profileData.displayName,
        });

        // Update email if it has changed
        if (profileData.email !== user.email) {
          await updateEmail(user, profileData.email);
        }

        // Update Firestore document (would be implemented in a full app)
        // const userDocRef = doc(db, "users", user.uid);
        // await updateDoc(userDocRef, {
        //   displayName: profileData.displayName,
        //   email: profileData.email
        // });

        toast({
          title: "Profile Updated",
          description:
            "Your personal information has been updated successfully.",
        });
      }
    } catch (err: unknown) {
      console.error("Error updating profile:", err);

      // Handle specific Firebase errors
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/requires-recent-login") {
        setError("Please log out and log in again to update your email.");
      } else if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already in use by another account.");
      } else {
        setError(
          "An error occurred while updating information. Please try again later."
        );
      }

      toast({
        title: "Update Error",
        description: "Unable to update information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password
    if (!passwordData.currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Confirmation password doesn't match.");
      return;
    }

    setIsPasswordUpdating(true);

    try {
      if (user && user.email) {
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(
          user.email,
          passwordData.currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, passwordData.newPassword);

        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
      }
    } catch (err: unknown) {
      console.error("Error updating password:", err);

      // Handle specific Firebase errors
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many unsuccessful requests. Please try again later.");
      } else {
        setError(
          "An error occurred while updating password. Please try again later."
        );
      }

      toast({
        title: "Password Update Error",
        description: "Unable to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>You're not logged in</CardTitle>
              <CardDescription>
                Please log in to view and manage your profile.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/login">Log In</a>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-muted-foreground mb-8">
          Manage your personal information and preferences
        </p>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Account tab */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="displayName"
                          name="displayName"
                          value={profileData.displayName}
                          onChange={handleProfileChange}
                          placeholder="Enter your display name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Changing your email will require re-verification of your
                        account.
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isProfileUpdating}
                    >
                      {isProfileUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to secure your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Re-enter new password"
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isPasswordUpdating}
                    >
                      {isPasswordUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Receive notifications about account activity and updates via
                    email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="darkMode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark mode
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          id="darkMode"
                          checked={preferences.darkMode}
                          onCheckedChange={toggleDarkMode}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about account activity and
                          updates via email
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={toggleEmailNotifications}
                      />
                    </div>

                    <Separator />

                    <div className="rounded-lg border p-4 bg-muted/20">
                      <div className="flex items-start gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Notification Types
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            More detailed notification options will be added in
                            the next version.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
