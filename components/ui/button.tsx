"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-saffron-400 text-white hover:bg-saffron-600",
        variant === "secondary" &&
          "bg-india-green text-white hover:bg-green-700",
        variant === "outline" &&
          "border border-stone-300 bg-white/80 text-stone-900 hover:bg-stone-50",
        variant === "ghost" && "text-stone-700 hover:bg-white/70",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-14 px-7 text-base",
        className
      )}
      {...props}
    />
  );
}
