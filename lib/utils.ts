import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currencyTotal(schemes: { annualBenefit?: string | null }[]) {
  const total = schemes.reduce((sum, scheme) => {
    if (!scheme.annualBenefit) {
      return sum;
    }

    const value = Number(scheme.annualBenefit.replace(/[^\d]/g, ""));
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return total > 0
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(total)
    : null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
