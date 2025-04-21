import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">
            {t("notFound.title")}
          </h1>
          <h2 className="text-2xl font-semibold mb-2">
            {t("notFound.heading")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("notFound.message")}</p>
          <Button asChild>
            <Link to="/">{t("notFound.returnHome")}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
