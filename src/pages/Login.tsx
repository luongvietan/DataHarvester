
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Đăng nhập DataHarvester</h1>
      <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-card shadow-md">
        <form className="space-y-4">
          {/* Sẽ bổ sung input sau */}
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Mật khẩu"
            type="password"
            required
          />
          <Button type="submit" className="w-full">Đăng nhập</Button>
        </form>
        <div className="flex flex-col gap-2 text-sm text-center">
          <Link to="/forgot-password" className="text-primary underline">Quên mật khẩu?</Link>
          <span>
            Chưa có tài khoản?{" "}
            <Link className="text-primary underline" to="/signup">Đăng ký</Link>
          </span>
        </div>
      </div>
    </main>
  );
};

export default Login;
