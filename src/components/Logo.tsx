
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <Database
        size={size}
        className="text-blue-500"
        strokeWidth={2}
      />

      {showText && (
        <span className="flex items-center font-bold text-xl">
          <span className="text-blue-600">Data</span>
          <span className="text-foreground">Harvester</span>
        </span>
      )}
    </div>
  );
}
