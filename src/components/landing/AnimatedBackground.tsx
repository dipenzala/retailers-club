"use client";
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDFCFF] via-white to-[#FFF9F5]" />

      {/* Blob 1 — Top-left purple */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.35] blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)",
          animation: "blobFloat1 22s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Blob 2 — Top-right pink */}
      <div
        className="absolute -top-20 -right-40 w-[550px] h-[550px] rounded-full opacity-[0.3] blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.6), transparent 70%)",
          animation: "blobFloat2 26s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Blob 3 — Bottom-left amber */}
      <div
        className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full opacity-[0.25] blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.5), transparent 70%)",
          animation: "blobFloat3 24s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Blob 4 — Bottom-right indigo */}
      <div
        className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full opacity-[0.28] blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.6), transparent 70%)",
          animation: "blobFloat4 28s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Soft grid overlay (static, no lag) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
