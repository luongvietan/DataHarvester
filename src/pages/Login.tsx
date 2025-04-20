
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">Sign in to DataHarvester</h1>
      <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="mb-1 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="mb-1 block">Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input
                className="pl-10 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full gap-2">
            <LogIn className="inline-block" size={18} />
            Sign In
          </Button>
        </form>
        <div className="flex flex-col gap-2 text-sm text-center mt-5">
          <Link to="/forgot-password" className="text-primary underline font-medium hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
          <span>
            Don&apos;t have an account?{" "}
            <Link className="text-primary underline font-medium hover:text-primary/80" to="/signup">
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
};

export default Login;

