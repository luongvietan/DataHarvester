
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

/**
 * DataHarvester Logo component
 * Enhances the visual representation of data harvesting with a more refined design
 */
export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="relative group">
        {/* Improved database icon with layered gradient and glow effect */}
        <div className="relative">
          <Database
            size={size}
            className="text-transparent relative z-10 transition-all 
              group-hover:scale-110 group-hover:rotate-6"
            strokeWidth={2.5}
            style={{
              stroke: "url(#logo-gradient)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-500/30 
            rounded-full blur-xl -z-10 group-hover:opacity-70 transition-opacity"></div>
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

        {/* Advanced data node network with more dynamic connections */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 z-20 opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <circle cx="6" cy="6" r="1.5" className="fill-blue-500 animate-pulse" />
          <circle cx="18" cy="7" r="1" className="fill-green-500" />
          <circle cx="14" cy="14" r="1.5" className="fill-indigo-500" />
          <circle cx="7" cy="16" r="1" className="fill-teal-500" />
          <path
            d="M6 6L14 14M6 6L7 16M6 6L18 7M14 14L7 16M14 14L18 7"
            stroke="url(#logo-gradient)"
            strokeWidth="0.8"
            className="opacity-60 group-hover:opacity-80 transition-opacity"
          />
        </svg>
      </div>

      {showText && (
        <span className="font-bold text-xl tracking-tight flex items-center">
          <span 
            className="bg-gradient-to-r from-blue-600 to-emerald-600 
            bg-clip-text text-transparent font-extrabold"
          >
            Data
          </span>
          <span className="font-semibold text-foreground ml-1">Harvester</span>
        </span>
      )}
    </div>
  );
}
