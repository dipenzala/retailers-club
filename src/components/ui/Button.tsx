import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
    const sizes = {
      sm: "px-3 py-2 text-[13px]",
      md: "px-4 py-2.5 text-[14px]",
      lg: "px-6 py-3.5 text-[15px]",
    };
    const variants = {
      primary: "bg-[#0A0A0A] text-white hover:bg-[#262626]",
      secondary: "bg-white border border-[#E7E5E4] text-[#0A0A0A] hover:border-[#0A0A0A]",
      ghost: "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAF9]",
      gold: "bg-[#B8894A] text-white hover:bg-[#a17840]",
    };
    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
