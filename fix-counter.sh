#!/bin/bash
set -e

echo "🔧 Fixing TrustBar Counter..."

cat > src/components/landing/TrustBar.tsx << 'EOF'
"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <div ref={ref}>{value.toLocaleString("en-IN") + suffix}</div>;
}

export default function TrustBar() {
  const stats = [
    { v: 10000, s: "+", l: "Verified Manufacturers" },
    { v: 50000, s: "+", l: "Retailers Onboarded" },
    { v: 28, s: "", l: "States Covered" },
    { v: 3, s: "L+", l: "User Capacity" },
  ];
  return (
    <section className="border-y border-[#E7E5E4] py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-[2.5rem] md:text-[3rem] font-extrabold tracking-tight text-[#0A0A0A] leading-none">
              <Counter to={s.v} suffix={s.s} />
            </div>
            <div className="mt-3 text-[13px] text-[#6B6B6B] font-medium">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
EOF

echo ""
echo "✅ Counter fixed!"
echo ""
echo "Now run:"
echo "  rm -rf .next"
echo "  npm run dev"