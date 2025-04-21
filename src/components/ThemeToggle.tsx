import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { t } = useTranslation();

  // Kiểm tra theme hiện tại khi component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkTheme(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    setIsDarkTheme(!isDarkTheme);

    // Cập nhật theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    // Lưu vào localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkTheme ? t("theme.light") : t("theme.dark")}
      title={isDarkTheme ? t("theme.light") : t("theme.dark")}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {isDarkTheme ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isDarkTheme ? t("theme.light") : t("theme.dark")}
      </span>
    </Button>
  );
}
