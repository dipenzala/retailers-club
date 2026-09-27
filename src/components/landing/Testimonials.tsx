"use client";
const items = [
  { q: "Surat se Delhi tak — 3 din me verified manufacturers mile. Pehle mahine me 40 orders.", n: "Rakesh M.", r: "Retailer, Jaipur" },
  { q: "AI upload ne meri 200 products 2 ghante me list kar di. Pehle 2 hafte lagte the.", n: "Priya S.", r: "Manufacturer, Surat" },
  { q: "Real-time chat aur RFQ system ne humara sales cycle 60% kam kar diya.", n: "Amit K.", r: "Wholesaler, Ludhiana" },
  { q: "Location-based search ne local buyer-seller matching 10x fast kiya.", n: "Sneha P.", r: "Retailer, Ahmedabad" },
];

export default function Testimonials() {
  const row = [...items, ...items];
  return (
    <section className="py-24 overflow-hidden bg-white border-y border-[#E7E5E4]">
      <div className="text-center mb-14 px-6">
        <div className="eyebrow mb-4">Trusted</div>
        <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
          Voices from the trade
        </h2>
      </div>
      <div className="flex gap-4 marquee w-max">
        {row.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-[#E7E5E4] rounded-2xl p-6 w-[360px] shrink-0"
          >
            <p className="text-[14px] leading-relaxed text-[#0A0A0A]">"{t.q}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[12px] font-bold">
                {t.n.charAt(0)}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0A0A0A]">{t.n}</div>
                <div className="text-[12px] text-[#6B6B6B]">{t.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
