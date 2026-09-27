export default function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative py-16 px-5 bg-gradient-to-b from-[#FAFAF9] to-white border-b border-[#E7E5E4]">
      <div className="max-w-4xl mx-auto text-center">
        {eyebrow && <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">{eyebrow}</div>}
        <h1 className="text-[2rem] md:text-[3rem] font-extrabold tracking-[-0.02em] leading-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-[15px] text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
