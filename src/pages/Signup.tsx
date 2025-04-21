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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Vui lòng kiểm tra mật khẩu xác nhận của bạn.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      setVerificationSent(true);
      toast({
        title: "Đăng ký thành công",
        description:
          "Một email xác thực đã được gửi đến địa chỉ email của bạn.",
      });
    } catch (error: unknown) {
      const authError = error as { message?: string };
      toast({
        title: "Đăng ký thất bại",
        description:
          authError.message || "Đã xảy ra lỗi khi tạo tài khoản của bạn.",
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
              <h1 className="text-2xl font-bold">Xác thực email của bạn</h1>
              <p className="text-muted-foreground">
                Chúng tôi đã gửi một email xác thực đến {email}. Vui lòng kiểm
                tra hộp thư đến của bạn và nhấp vào liên kết để xác thực tài
                khoản của bạn.
              </p>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Không nhận được email?</AlertTitle>
                <AlertDescription>
                  Kiểm tra thư mục spam của bạn hoặc{" "}
                  <button
                    onClick={async () => {
                      try {
                        await signUp(email, password, name);
                        toast({
                          title: "Email đã được gửi lại",
                          description: "Vui lòng kiểm tra hộp thư đến của bạn.",
                        });
                      } catch (error) {
                        toast({
                          title: "Không thể gửi lại email",
                          description: "Vui lòng thử lại sau.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="font-medium underline hover:text-primary"
                  >
                    gửi lại email xác thực
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
                  Quay lại đăng ký
                </Button>
                <Button onClick={() => navigate("/login")}>
                  Đi đến đăng nhập
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
          Tạo tài khoản DataHarvester
        </h1>
        <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="mb-1 block">
                Họ tên
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
                  placeholder="Nhập họ tên của bạn"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
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
                  placeholder="Tạo mật khẩu"
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
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm_password" className="mb-1 block">
                Xác nhận mật khẩu
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
                  placeholder="Nhập lại mật khẩu"
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
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
          <div className="text-sm text-center mt-5">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary underline font-medium hover:text-primary/80"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
