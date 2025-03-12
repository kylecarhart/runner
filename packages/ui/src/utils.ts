import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function that combines Tailwind classes while properly handling
 * conflicts.
 * @param inputs - Class names, conditional classes, or arrays of classes
 * @returns Merged and deduped class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
