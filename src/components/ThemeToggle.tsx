import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

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
      aria-label={
        isDarkTheme ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
      title={isDarkTheme ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {isDarkTheme ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isDarkTheme ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      </span>
    </Button>
  );
}
