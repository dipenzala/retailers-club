import { cn } from "@/lib/utils/cn";

export function Avatar({
  name,
  size = 36,
  className,
}: { name: string; size?: number; className?: string }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className={cn(
        "rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-bold shrink-0",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
