import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[#0A0A0A] text-[14px] placeholder:text-[#9B9B9B] focus:border-[#0A0A0A] transition",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
