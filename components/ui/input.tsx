import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#d7c1c3] bg-white px-4 py-2 text-sm text-[#211a1b] shadow-sm transition-colors placeholder:text-[#857374] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#735c00]/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
