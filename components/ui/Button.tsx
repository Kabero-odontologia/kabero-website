import { Link } from "@/i18n/navigation";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "outline-soft" | "ghost" | "ghost-selected" | "glass";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-orange-6 text-black-1 hover:bg-orange-5",
  secondary: "bg-black-11 text-black-1 hover:bg-black-10",
  outline: "bg-transparent text-black-11 border border-black-11 hover:bg-black-2",
  "outline-soft": "bg-transparent text-black-11 border border-black-8 hover:border-black-11",
  ghost: "bg-transparent text-black-11 border border-black-4 hover:border-black-11",
  "ghost-selected": "bg-orange-1 text-orange-6 border border-orange-2",
  // Admin-panel "liquid glass" style: translucent, blurred, soft border highlight.
  glass: "bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white hover:bg-white/[0.14] shadow-[0_2px_12px_rgba(0,0,0,0.15)]",
};

const sizeStyles: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { md: "px-6 py-3.5", sm: "px-6 py-2" },
  secondary: { md: "px-6 py-3.5", sm: "px-6 py-2" },
  outline: { md: "px-6 py-3.5", sm: "px-6 py-2" },
  "outline-soft": { md: "px-6 py-3.5", sm: "px-6 py-2" },
  ghost: { md: "px-5 py-2.5", sm: "px-4 py-2" },
  "ghost-selected": { md: "px-5 py-2.5", sm: "px-4 py-2" },
  glass: { md: "px-6 py-3.5", sm: "px-5 py-2.5" },
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full text-headline-sm font-semibold transition-colors whitespace-nowrap";
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[variant][size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
