import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast({
        title: "Email đặt lại đã được gửi",
        description:
          "Vui lòng kiểm tra hộp thư đến của bạn để đặt lại mật khẩu.",
      });
    } catch (error: unknown) {
      const authError = error as { message?: string; code?: string };
      let errorMessage = "Vui lòng kiểm tra email của bạn và thử lại.";

      if (authError.code === "auth/user-not-found") {
        errorMessage = "Không tìm thấy tài khoản với email này.";
      } else if (authError.message) {
        errorMessage = authError.message;
      }

      toast({
        title: "Yêu cầu thất bại",
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
        <h1 className="text-3xl font-bold mb-4 text-primary">Quên mật khẩu</h1>
        <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Email đã được gửi!</h2>
              <p className="text-muted-foreground">
                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến{" "}
                <span className="font-medium">{email}</span>. Vui lòng kiểm tra
                hộp thư đến của bạn.
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
                  Gửi lại đến email khác
                </Button>
                <Link to="/login">
                  <Button className="w-full">Quay lại đăng nhập</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết
                để đặt lại mật khẩu.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                      placeholder="Nhập địa chỉ email của bạn"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
                </Button>
              </form>
              <div className="text-sm text-center mt-2">
                <Link
                  to="/login"
                  className="text-primary underline hover:text-primary/80"
                >
                  Quay lại đăng nhập
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
