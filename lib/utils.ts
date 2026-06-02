import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextMonth(year: number, monthIndex: number) {
  if (monthIndex >= 11) {
    return { year: year + 1, monthIndex: 0 };
  }
  return { year, monthIndex: monthIndex + 1 };
}

export function getPrevMonth(year: number, monthIndex: number) {
  if (monthIndex <= 0) {
    return { year: year - 1, monthIndex: 11 };
  }
  return { year, monthIndex: monthIndex - 1 };
}

export function getContrastColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate perceived brightness (YIQ formula)
  const Y = (r * 299 + g * 587 + b * 114) / 1000;

  return Y >= 128 ? "var(--foreground)" : "var(--background)";
}

export function formatCentsToStrSEK(
  cents: number,
  maximumFractionDigits?: number
) {
  return (cents / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits,
  });
}
