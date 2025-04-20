
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">Create your DataHarvester account</h1>
      <div className="w-full max-w-sm p-8 rounded-2xl bg-gradient-to-br from-card/80 via-secondary/70 to-background/70 shadow-xl glass-morphism border border-border">
        <form className="space-y-5">
          <div>
            <Label htmlFor="name" className="mb-1 block">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>
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
                placeholder="Create a password"
                autoComplete="new-password"
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
          <div>
            <Label htmlFor="confirm_password" className="mb-1 block">Confirm Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input
                className="pl-10 pr-10"
                id="confirm_password"
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-2.5 text-muted-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <div className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline font-medium hover:text-primary/80">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;

