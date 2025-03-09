import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const labelVariants = cva(
  "text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

/**
 * Label component with consistent styling and accessibility features. If using
 * in a form, you may want to use the FormLabel component instead.
 */
const Label = (
  {
    ref,
    className,
    ...props
  }
) => (<LabelPrimitive.Root
  ref={ref}
  className={cn(labelVariants(), className)}
  {...props}
/>);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
