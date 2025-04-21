
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div className={cn(
      "flex items-center select-none", 
      "gap-2 sm:gap-3", // Responsive gap
      className
    )}>
      <Database
        size={size}
        className="text-blue-500 min-w-[24px]"
        strokeWidth={2}
      />

      {showText && (
        <span className="flex items-center font-bold text-lg sm:text-xl truncate">
          <span className="text-blue-600">Data</span>
          <span className="text-foreground">Harvester</span>
        </span>
      )}
    </div>
  );
}
