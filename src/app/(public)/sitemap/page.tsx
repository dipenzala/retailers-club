import PageHero from "@/components/public/PageHero";
import Link from "next/link";

const LINKS = [
  { t: "Main Pages", items: [
    { l: "Home", h: "/" }, { l: "Login", h: "/login" }, { l: "Register", h: "/register" },
    { l: "Feed", h: "/feed" }, { l: "Search", h: "/search" }, { l: "Products", h: "/products" },
    { l: "RFQs", h: "/rfq" }, { l: "Chat", h: "/chat" }, { l: "Orders", h: "/orders" },
  ]},
  { t: "Categories", items: [
    { l: "Women's Wear", h: "/search?category=womens-wear" },
    { l: "Men's Wear", h: "/search?category=mens-wear" },
    { l: "Kids Wear", h: "/search?category=kids-wear" },
    { l: "Ethnic Wear", h: "/search?category=ethnic-wear" },
    { l: "Winter Wear", h: "/search?category=winter-wear" },
    { l: "Sports Wear", h: "/search?category=sports-wear" },
    { l: "Accessories", h: "/search?category=accessories" },
    { l: "Innerwear", h: "/search?category=innerwear" },
  ]},
  { t: "Company", items: [
    { l: "About", h: "/about" }, { l: "Careers", h: "/careers" },
    { l: "Blog", h: "/blog" }, { l: "Press", h: "/press" },
  ]},
  { t: "Support", items: [
    { l: "Help Center", h: "/help" }, { l: "Contact", h: "/contact" },
    { l: "FAQ", h: "/faq" }, { l: "Report Issue", h: "/report" },
  ]},
  { t: "Legal", items: [
    { l: "Privacy Policy", h: "/privacy" }, { l: "Terms of Service", h: "/terms" },
  ]},
  { t: "Account", items: [
    { l: "Profile Settings", h: "/settings" }, { l: "Verification", h: "/verification" },
    { l: "Boost", h: "/boost" }, { l: "Referrals", h: "/referrals" },
  ]},
];

export default function Sitemap() {
  return (
    <>
      <PageHero eyebrow="Sitemap" title="Sab Kuch Ek Jagah" subtitle="Har page ka quick link — jo bhi dhundh rahe ho, yahan mil jaayega." />

      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
          {LINKS.map((s) => (
            <div key={s.t}>
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">{s.t}</div>
              <ul className="space-y-2">
                {s.items.map((i) => (
                  <li key={i.h}>
                    <Link href={i.h} className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A]">→ {i.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
