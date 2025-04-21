import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast({
        title: t("auth.resetEmailSent"),
        description: t("auth.resetEmailSentDesc"),
      });
    } catch (error: unknown) {
      const authError = error as { message?: string; code?: string };
      let errorMessage = t("errors.general");

      if (authError.code === "auth/user-not-found") {
        errorMessage = "Không tìm thấy tài khoản với email này.";
      } else if (authError.message) {
        errorMessage = authError.message;
      }

      toast({
        title: t("auth.resetRequestFailed"),
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
        <h1 className="text-3xl font-bold mb-4 text-primary">
          {t("forgotPassword.title")}
        </h1>
        <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">
                {t("forgotPassword.successTitle")}
              </h2>
              <p className="text-muted-foreground">
                {t("forgotPassword.successDesc", { email })}
              </p>
              <div className="space-y-2 mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                >
                  {t("forgotPassword.sendToAnother")}
                </Button>
                <Link to="/login">
                  <Button className="w-full">
                    {t("forgotPassword.backToLogin")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                {t("forgotPassword.description")}
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email" className="mb-1 block">
                    {t("forgotPassword.email")}
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
                      placeholder={t("forgotPassword.emailPlaceholder")}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("forgotPassword.loading")
                    : t("forgotPassword.submit")}
                </Button>
              </form>
              <div className="text-sm text-center mt-2">
                <Link
                  to="/login"
                  className="text-primary underline hover:text-primary/80"
                >
                  {t("forgotPassword.backToLogin")}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
