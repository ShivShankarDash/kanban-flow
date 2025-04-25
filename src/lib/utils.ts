import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Example of a simple ID generator (replace with a more robust solution like UUID if needed)
// export function generateId(prefix: string = 'id'): string {
//   return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
// }
