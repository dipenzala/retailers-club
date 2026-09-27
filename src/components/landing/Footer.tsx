import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E5E4] px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="font-bold text-[#0A0A0A] text-[15px]">
                Retailers Club
              </span>
            </div>
            <p className="mt-4 text-[13px] text-[#6B6B6B] max-w-xs leading-relaxed">
              India's AI-powered garment B2B network. Verified manufacturers,
              real-time trade.
            </p>
          </div>
          {[
            { t: "Product", l: ["Features", "Pricing", "AI Search", "RFQ"] },
            { t: "Company", l: ["About", "Careers", "Blog", "Contact"] },
            { t: "Legal", l: ["Privacy", "Terms", "Security", "Compliance"] },
          ].map((c, i) => (
            <div key={i}>
              <div className="text-[13px] font-bold mb-4 text-[#0A0A0A]">
                {c.t}
              </div>
              <ul className="space-y-2.5">
                {c.l.map((x) => (
                  <li key={x}>
                    <Link
                      href="#"
                      className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition"
                    >
                      {x}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[#E7E5E4] flex flex-col md:flex-row justify-between gap-3 text-[12px] text-[#6B6B6B]">
          <div>© 2026 Retailers Club. All rights reserved.</div>
          <div className="font-medium">Made in India</div>
        </div>
      </div>
    </footer>
  );
}
