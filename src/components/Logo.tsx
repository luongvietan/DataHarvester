
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative">
        {/* Simple, clean database icon with a subtle gradient */}
        <Database
          size={size}
          className="text-blue-500 transition-all hover:scale-105"
          strokeWidth={2}
        />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl -z-10 opacity-75" />
      </div>

      {showText && (
        <span className="font-bold text-xl tracking-tight">
          <span className="text-blue-600">Data</span>
          <span className="text-foreground">Harvester</span>
        </span>
      )}
    </div>
  );
}
