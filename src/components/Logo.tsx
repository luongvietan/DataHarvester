import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  showText?: boolean;
};

export function Logo({ className, size = 36, showText = true }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center select-none",
        "gap-2 sm:gap-3", // Responsive gap
        className
      )}
    >
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="min-w-[24px]"
        >
          {/* Stylized data nodes and connections */}
          <circle
            cx="12"
            cy="6"
            r="3"
            className="fill-blue-500 dark:fill-blue-400"
          />
          <circle
            cx="6"
            cy="16"
            r="3"
            className="fill-blue-500 dark:fill-blue-400"
          />
          <circle
            cx="18"
            cy="16"
            r="3"
            className="fill-blue-500 dark:fill-blue-400"
          />

          {/* Connection lines */}
          <path
            d="M12 9L6 13M12 9L18 13"
            stroke="currentColor"
            strokeWidth="1.5"
            className="stroke-blue-600 dark:stroke-blue-300"
            strokeLinecap="round"
          />

          {/* Data flow animation */}
          <circle
            cx="9"
            cy="11"
            r="0.8"
            className="fill-white dark:fill-gray-900 animate-ping-slow"
          />
          <circle
            cx="15"
            cy="11"
            r="0.8"
            className="fill-white dark:fill-gray-900 animate-ping-slow animation-delay-500"
          />
        </svg>
      </div>

      {showText && (
        <span className="flex items-center font-bold text-lg sm:text-xl truncate">
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
            Data
          </span>
          <span className="text-foreground">Harvester</span>
        </span>
      )}
    </div>
  );
}
