import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-violet text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]",
  secondary:
    "bg-surface text-foreground border border-border hover:border-foreground/20 hover:bg-surface-hover",
  ghost: "bg-transparent text-muted hover:text-foreground",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 no-underline cursor-pointer ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
