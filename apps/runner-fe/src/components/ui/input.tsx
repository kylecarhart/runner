import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * Input component with consistent styling and full form control support
 */
const Input = (
  {
    ref,
    className,
    type,
    ...props
  }: React.ComponentProps<"input"> & {
    ref: React.RefObject<HTMLInputElement>;
  }
) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
Input.displayName = "Input";

export { Input };
