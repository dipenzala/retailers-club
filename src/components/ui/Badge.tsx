import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "gold" | "info";

const variants: Record<Variant, string> = {
  default: "bg-[#FAFAF9] text-[#6B6B6B] border-[#E7E5E4]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  gold: "bg-[#FBF6EF] text-[#B8894A] border-[#E8D9BF]",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
