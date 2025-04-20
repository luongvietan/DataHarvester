
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
        {/* Main database icon */}
        <Database 
          size={size} 
          className="text-primary relative z-10"
          strokeWidth={2}
        />
        
        {/* Data node network overlay */}
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 z-20 opacity-70"
        >
          <circle cx="6" cy="6" r="1.5" className="fill-accent" />
          <circle cx="18" cy="7" r="1" className="fill-accent" />
          <circle cx="14" cy="14" r="1.5" className="fill-accent" />
          <circle cx="7" cy="16" r="1" className="fill-accent" />
          <path d="M6 6L14 14M6 6L7 16M6 6L18 7M14 14L7 16M14 14L18 7M7 16L18 7" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                className="opacity-70" />
        </svg>
      </div>
      
      {showText && (
        <span className="font-bold text-xl tracking-tight">
          <span className="text-primary">Data</span>
          <span>Harvester</span>
        </span>
      )}
    </div>
  );
}
