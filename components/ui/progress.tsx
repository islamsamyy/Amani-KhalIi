import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }
>(({ className, value = 0, max = 100, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[#faeaeb]",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-l from-[#4a1521] to-[#735c00] transition-all duration-300 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };

