import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

const button = cva("flex items-center gap-2", {
  variants: {
    intent: {
      default: "text-white bg-black border border-gray-500 disabled:opacity-50",
      ghost: "text-black bg-transparent disabled:opacity-50 hover:bg-gray-100",
    },
    size: {
      default: "rounded-md px-4 py-2 text-base",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "default",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  children: React.ReactNode;
}

export default function Button({
  intent = "default",
  size = "default",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(button({ intent, size }), className)} {...props}>
      {children}
    </button>
  );
}
