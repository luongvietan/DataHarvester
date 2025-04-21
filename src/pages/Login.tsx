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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationNeeded, setEmailVerificationNeeded] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
        title: "Đăng nhập thành công",
        description: "Bạn đang được chuyển hướng đến bảng điều khiển.",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      const authError = error as { message?: string; code?: string };
      let errorMessage = "Vui lòng kiểm tra thông tin đăng nhập và thử lại.";

      if (authError.code === "auth/wrong-password") {
        errorMessage = "Sai mật khẩu. Vui lòng thử lại.";
      } else if (authError.code === "auth/user-not-found") {
        errorMessage = "Không tìm thấy tài khoản với email này.";
      } else if (authError.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau.";
      } else if (authError.message) {
        errorMessage = authError.message;
      }

      toast({
        title: "Đăng nhập thất bại",
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
          Đăng nhập vào DataHarvester
        </h1>

        <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          {emailVerificationNeeded && (
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vui lòng xác thực email của bạn trước khi đăng nhập. Kiểm tra
                hộp thư đến của bạn.
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="mb-1 block">
                Email
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
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="mb-1 block">
                Mật khẩu
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
                  placeholder="Nhập mật khẩu của bạn"
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
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
          <div className="flex flex-col gap-2 text-sm text-center mt-5">
            <Link
              to="/forgot-password"
              className="text-primary underline font-medium hover:text-primary/80 transition-colors"
            >
              Quên mật khẩu?
            </Link>
            <span>
              Chưa có tài khoản?{" "}
              <Link
                className="text-primary underline font-medium hover:text-primary/80"
                to="/signup"
              >
                Đăng ký
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
