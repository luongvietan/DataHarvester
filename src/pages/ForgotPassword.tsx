
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Quên mật khẩu</h1>
      <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-card shadow-md">
        <form className="space-y-4">
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập email để khôi phục"
            type="email"
            required
          />
          <Button type="submit" className="w-full">Gửi liên kết đặt lại mật khẩu</Button>
        </form>
        <div className="text-sm text-center mt-2">
          <Link to="/login" className="text-primary underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
