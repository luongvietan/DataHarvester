import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Key, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t("auth.passwordsDontMatch"),
        description: t("auth.passwordsDontMatchDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      setVerificationSent(true);
      toast({
        title: t("auth.signupSuccess"),
        description: t("auth.signupSuccessDesc"),
      });
    } catch (error: unknown) {
      const authError = error as { message?: string };
      toast({
        title: t("auth.signupFailed"),
        description: authError.message || t("errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-2xl bg-card shadow border border-border">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">{t("signup.verifyTitle")}</h1>
              <p className="text-muted-foreground">
                {t("signup.verifyDesc", { email })}
              </p>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("signup.didntReceive")}</AlertTitle>
                <AlertDescription>
                  {t("errors.general")}{" "}
                  <button
                    onClick={async () => {
                      try {
                        await signUp(email, password, name);
                        toast({
                          title: t("auth.emailResent"),
                          description: t("auth.emailResentDesc"),
                        });
                      } catch (error) {
                        toast({
                          title: t("auth.emailNotResent"),
                          description: t("auth.emailNotResentDesc"),
                          variant: "destructive",
                        });
                      }
                    }}
                    className="font-medium underline hover:text-primary"
                  >
                    {t("signup.resendEmail")}
                  </button>
                </AlertDescription>
              </Alert>

              <div className="flex space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setVerificationSent(false);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setName("");
                  }}
                >
                  {t("signup.backToSignup")}
                </Button>
                <Button onClick={() => navigate("/login")}>
                  {t("signup.goToLogin")}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary">
          {t("signup.title")}
        </h1>
        <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="mb-1 block">
                {t("signup.name")}
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10"
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("signup.namePlaceholder")}
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="mb-1 block">
                {t("signup.email")}
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
                  placeholder={t("signup.emailPlaceholder")}
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="mb-1 block">
                {t("signup.password")}
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
                  placeholder={t("signup.passwordPlaceholder")}
                  autoComplete="new-password"
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
            <div>
              <Label htmlFor="confirm_password" className="mb-1 block">
                {t("signup.confirmPassword")}
              </Label>
              <div className="relative">
                <Key
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10 pr-10"
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("signup.confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  aria-label={
                    showConfirm
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("signup.loading") : t("signup.submit")}
            </Button>
          </form>
          <div className="text-sm text-center mt-5">
            {t("signup.haveAccount")}{" "}
            <Link
              className="text-primary underline hover:text-primary/80"
              to="/login"
            >
              {t("auth.login")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
