import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[#E7E5E4] py-12 px-5 bg-white mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="font-extrabold text-[15px]">Retailers Club</span>
            </Link>
            <p className="mt-4 text-[13px] text-[#6B6B6B] max-w-xs leading-relaxed">
              India's largest B2B garment marketplace. Connecting verified manufacturers and retailers nationwide.
            </p>
            <div className="mt-4 flex gap-2">
              {[
                { l: "I", n: "Instagram", url: "https://instagram.com" },
                { l: "F", n: "Facebook", url: "https://facebook.com" },
                { l: "L", n: "LinkedIn", url: "https://linkedin.com" },
                { l: "Y", n: "YouTube", url: "https://youtube.com" },
              ].map((s) => (
                <a key={s.n} href={s.url} target="_blank" rel="noopener"
                  className="w-8 h-8 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[11px] font-bold hover:bg-[#0A0A0A] hover:text-white transition">
                  {s.l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-bold mb-4 uppercase tracking-wider text-[#0A0A0A]">Categories</div>
            <ul className="space-y-2.5 text-[13px] text-[#6B6B6B]">
              <li><Link href="/search?category=womens-wear" className="hover:text-[#0A0A0A]">Women's Wear</Link></li>
              <li><Link href="/search?category=mens-wear" className="hover:text-[#0A0A0A]">Men's Wear</Link></li>
              <li><Link href="/search?category=kids-wear" className="hover:text-[#0A0A0A]">Kids Wear</Link></li>
              <li><Link href="/search?category=ethnic-wear" className="hover:text-[#0A0A0A]">Ethnic Wear</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-bold mb-4 uppercase tracking-wider text-[#0A0A0A]">Company</div>
            <ul className="space-y-2.5 text-[13px] text-[#6B6B6B]">
              <li><Link href="/about" className="hover:text-[#0A0A0A]">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[#0A0A0A]">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-[#0A0A0A]">Blog</Link></li>
              <li><Link href="/press" className="hover:text-[#0A0A0A]">Press</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-bold mb-4 uppercase tracking-wider text-[#0A0A0A]">Support</div>
            <ul className="space-y-2.5 text-[13px] text-[#6B6B6B]">
              <li><Link href="/help" className="hover:text-[#0A0A0A]">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-[#0A0A0A]">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-[#0A0A0A]">FAQ</Link></li>
              <li><Link href="/report" className="hover:text-[#0A0A0A]">Report</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E7E5E4] flex flex-col md:flex-row justify-between gap-3 text-[12px] text-[#6B6B6B]">
          <div>© 2026 Retailers Club. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#0A0A0A]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0A0A0A]">Terms</Link>
            <Link href="/sitemap" className="hover:text-[#0A0A0A]">Sitemap</Link>
          </div>
          <div>Made in India 🇮🇳</div>
        </div>
      </div>
    </footer>
  );
}
