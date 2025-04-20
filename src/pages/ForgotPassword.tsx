
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        <div className="w-full max-w-sm space-y-4 p-6 rounded-lg bg-card shadow-md">
          <form className="space-y-4">
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email address"
              type="email"
              required
            />
            <Button type="submit" className="w-full">Send reset password link</Button>
          </form>
          <div className="text-sm text-center mt-2">
            <Link to="/login" className="text-primary underline">Back to login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
