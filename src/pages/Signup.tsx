
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Signup = () => {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Đăng ký tài khoản mới</h1>
      <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-card shadow-md">
        <form className="space-y-4">
          {/* Sẽ bổ sung input sau */}
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Họ và tên"
            type="text"
            required
          />
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
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập lại mật khẩu"
            type="password"
            required
          />
          <Button type="submit" className="w-full">Đăng ký</Button>
        </form>
        <div className="text-sm text-center">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary underline">Đăng nhập</Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;
