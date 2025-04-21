import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container flex flex-col items-center text-center">
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("hero.title", {
              appName: <span className="text-primary">DataHarvester</span>,
            })}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                {t("hero.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/features">{t("hero.learnMore")}</a>
            </Button>
          </div>
        </div>

        {/* Hero visualization */}
        <div className="mt-16 w-full max-w-5xl">
          <div className="relative aspect-video rounded-xl border border-border/40 bg-card shadow-lg overflow-hidden">
            {/* Data harvesting visualization */}
            <div className="absolute inset-0 p-8">
              <svg
                className="w-full h-full"
                viewBox="0 0 800 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background grid */}
                <path
                  d="M0 0 L800 0 L800 450 L0 450 Z"
                  className="fill-card/20"
                />
                <path
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="1"
                  d="M0 50 L800 50 M0 100 L800 100 M0 150 L800 150 M0 200 L800 200 M0 250 L800 250 M0 300 L800 300 M0 350 L800 350 M0 400 L800 400"
                />
                <path
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="1"
                  d="M50 0 L50 450 M100 0 L100 450 M150 0 L150 450 M200 0 L200 450 M250 0 L250 450 M300 0 L300 450 M350 0 L350 450 M400 0 L400 450 M450 0 L450 450 M500 0 L500 450 M550 0 L550 450 M600 0 L600 450 M650 0 L650 450 M700 0 L700 450 M750 0 L750 450"
                />

                {/* Data nodes */}
                <g className="data-nodes">
                  <circle
                    cx="150"
                    cy="100"
                    r="12"
                    className="fill-primary"
                    opacity="0.8"
                  />
                  <circle
                    cx="300"
                    cy="180"
                    r="10"
                    className="fill-primary"
                    opacity="0.7"
                  />
                  <circle
                    cx="420"
                    cy="120"
                    r="14"
                    className="fill-primary"
                    opacity="0.9"
                  />
                  <circle
                    cx="550"
                    cy="220"
                    r="11"
                    className="fill-primary"
                    opacity="0.7"
                  />
                  <circle
                    cx="650"
                    cy="150"
                    r="13"
                    className="fill-primary"
                    opacity="0.8"
                  />
                  <circle
                    cx="250"
                    cy="300"
                    r="12"
                    className="fill-primary"
                    opacity="0.7"
                  />
                  <circle
                    cx="400"
                    cy="350"
                    r="15"
                    className="fill-primary"
                    opacity="0.9"
                  />
                  <circle
                    cx="600"
                    cy="300"
                    r="10"
                    className="fill-primary"
                    opacity="0.6"
                  />
                </g>

                {/* Connection lines */}
                <g
                  className="connections"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                >
                  <path
                    className="stroke-primary"
                    d="M150 100 L300 180 L420 120 L550 220 L650 150"
                  />
                  <path
                    className="stroke-primary"
                    d="M300 180 L250 300 L400 350 L600 300"
                  />
                  <path className="stroke-primary" d="M420 120 L400 350" />
                  <path className="stroke-primary" d="M550 220 L600 300" />
                </g>

                {/* Central node with pulse animation */}
                <circle
                  cx="400"
                  cy="225"
                  r="30"
                  className="fill-accent animate-pulse"
                  opacity="0.8"
                />
                <circle cx="400" cy="225" r="20" className="fill-primary" />
              </svg>
            </div>

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
