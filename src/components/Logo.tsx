import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

/**
 * DataHarvester Logo component
 * Combines a database icon with a custom node network graphic to represent data harvesting
 */
export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Main database icon with gradient effect */}
        <div className="relative">
          <Database
            size={size}
            className="text-transparent relative z-10"
            strokeWidth={2.2}
            style={{
              stroke: "url(#logo-gradient)",
            }}
          />
          <svg width="0" height="0">
            <linearGradient
              id="logo-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop stopColor="#3b82f6" offset="0%" />
              <stop stopColor="#10b981" offset="100%" />
            </linearGradient>
          </svg>
        </div>

        {/* Data node network overlay with improved styling */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 z-20 opacity-80"
        >
          <circle cx="6" cy="6" r="1.5" className="fill-accent animate-pulse" />
          <circle cx="18" cy="7" r="1" className="fill-accent" />
          <circle cx="14" cy="14" r="1.5" className="fill-accent" />
          <circle cx="7" cy="16" r="1" className="fill-accent" />
          <path
            d="M6 6L14 14M6 6L7 16M6 6L18 7M14 14L7 16M14 14L18 7M7 16L18 7"
            stroke="url(#logo-gradient)"
            strokeWidth="0.6"
            className="opacity-80"
          />
        </svg>
      </div>

      {showText && (
        <span className="font-bold text-xl tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            Data
          </span>
          <span className="font-semibold">Harvester</span>
        </span>
      )}
    </div>
  );
}
