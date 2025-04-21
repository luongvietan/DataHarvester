import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationNeeded, setEmailVerificationNeeded] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailVerificationNeeded(false);

    try {
      const user = await signIn(email, password);

      if (user && !user.emailVerified) {
        setEmailVerificationNeeded(true);
        setIsLoading(false);
        return;
      }

      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.loginSuccessDesc"),
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      const authError = error as { message?: string; code?: string };
      let errorMessage = t("errors.general");

      if (authError.code === "auth/wrong-password") {
        errorMessage = t("errors.auth.wrongPassword");
      } else if (authError.code === "auth/user-not-found") {
        errorMessage = "Không tìm thấy tài khoản với email này.";
      } else if (authError.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau.";
      } else if (authError.message) {
        errorMessage = authError.message;
      }

      toast({
        title: t("auth.loginFailed"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary">
          {t("login.title")}
        </h1>

        <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          {emailVerificationNeeded && (
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("auth.emailVerificationRequired")}
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="mb-1 block">
                {t("login.email")}
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10"
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="mb-1 block">
                {t("login.password")}
              </Label>
              <div className="relative">
                <Key
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10 pr-10"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin">●</span>
              ) : (
                <LogIn className="inline-block" size={18} />
              )}
              {isLoading ? t("login.loading") : t("login.submit")}
            </Button>
          </form>
          <div className="flex flex-col gap-2 text-sm text-center mt-5">
            <Link
              to="/forgot-password"
              className="text-primary underline font-medium hover:text-primary/80 transition-colors"
            >
              {t("login.forgotPassword")}
            </Link>
            <span>
              {t("login.noAccount")}{" "}
              <Link
                className="text-primary underline font-medium hover:text-primary/80"
                to="/signup"
              >
                {t("auth.signup")}
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
