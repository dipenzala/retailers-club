import PageHero from "@/components/public/PageHero";
import Link from "next/link";
import { ShieldCheck, Package, MessageSquare, CreditCard, User, Truck, ArrowRight } from "lucide-react";

const TOPICS = [
  { i: ShieldCheck, t: "Verification", d: "GST, PAN, MSME verification process" },
  { i: Package, t: "Products & Orders", d: "Upload, manage, and track orders" },
  { i: MessageSquare, t: "Chat & Communication", d: "Messaging, RFQ, quotations" },
  { i: CreditCard, t: "Payments & Billing", d: "Payment methods, invoices, refunds" },
  { i: User, t: "Account & Profile", d: "Profile setup, privacy, settings" },
  { i: Truck, t: "Shipping & Delivery", d: "Logistics, tracking, delivery issues" },
];

export default function Help() {
  return (
    <>
      <PageHero eyebrow="Help Center" title="Kaise Help Chahiye?" subtitle="Quick answers, guides, aur step-by-step tutorials." />

      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((t) => (
              <Link key={t.t} href="/faq" className="bg-white border rounded-2xl p-6 hover:shadow-md transition group">
                <div className="w-11 h-11 rounded-xl bg-[#FAFAF9] border flex items-center justify-center">
                  <t.i size={20} className="text-[#B8894A]" />
                </div>
                <div className="mt-4 text-[15px] font-bold">{t.t}</div>
                <div className="mt-1 text-[12px] text-[#6B6B6B]">{t.d}</div>
                <div className="mt-3 text-[12px] font-semibold text-[#B8894A] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 bg-[#0A0A0A] rounded-2xl p-8 md:p-12 text-center">
            <div className="text-white text-[1.5rem] md:text-[1.75rem] font-extrabold">Aur bhi help chahiye?</div>
            <p className="text-white/60 text-[14px] mt-3">Hamari support team 24/7 available hai.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="bg-white text-[#0A0A0A] font-semibold px-6 py-3 rounded-xl">Contact Support</Link>
              <a href="https://wa.me/919999999999" target="_blank" className="bg-white/10 backdrop-blur text-white border border-white/20 font-semibold px-6 py-3 rounded-xl">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
