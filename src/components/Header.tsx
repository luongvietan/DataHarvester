import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, User, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, signOut } = useFirebaseAuth();
  const { t } = useTranslation();

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  // Add dashboard to nav items if user is logged in
  const navItems = [...navLinks];
  if (user) {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold">{t("app.name")}</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/features"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/features"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("nav.features")}
            </Link>
            <Link
              to="/pricing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/pricing"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("nav.pricing")}
            </Link>
            <Link
              to="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/contact"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t("nav.contact")}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {t("nav.dashboard")}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/scraper">
                      <Download className="mr-2 h-4 w-4" />
                      <span>{t("nav.scraper")}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("auth.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">{t("auth.login")}</Button>
              </Link>
              <Link to="/signup">
                <Button>{t("auth.signup")}</Button>
              </Link>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Logo className="h-6 w-6" />
                    <span>{t("app.name")}</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  to="/features"
                  className="text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.features")}
                </Link>
                <Link
                  to="/pricing"
                  className="text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.pricing")}
                </Link>
                <Link
                  to="/contact"
                  className="text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.contact")}
                </Link>
                {user && (
                  <>
                    <Separator />
                    <Link
                      to="/dashboard"
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <Link
                      to="/profile"
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.profile")}
                    </Link>
                    <Link
                      to="/scraper"
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.scraper")}
                    </Link>
                  </>
                )}
              </nav>
              <div className="mt-6 flex justify-between">
                <div className="flex gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                {user ? (
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    size="sm"
                  >
                    {t("auth.logout")}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="sm">
                        {t("auth.login")}
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button size="sm">{t("auth.signup")}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
