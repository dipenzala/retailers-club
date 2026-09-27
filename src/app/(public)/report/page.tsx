"use client";
import PageHero from "@/components/public/PageHero";
import { AlertTriangle, ShieldAlert, Ban } from "lucide-react";

export default function Report() {
  return (
    <>
      <PageHero eyebrow="Report" title="Report an Issue" subtitle="Agar aapko kisi user, product, ya activity me problem dikhe — hume inform karein." />

      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { i: Ban, t: "Fake Seller", d: "GST ya documents fake lag rahe hain" },
              { i: ShieldAlert, t: "Fraud / Scam", d: "Payment ya product me fraud hua hai" },
              { i: AlertTriangle, t: "Abusive Content", d: "Offensive product ya message" },
            ].map((c) => (
              <div key={c.t} className="bg-white border rounded-2xl p-5 text-center">
                <c.i size={24} className="mx-auto text-[#B8894A]" />
                <div className="mt-3 text-[13px] font-bold">{c.t}</div>
                <div className="mt-1 text-[11px] text-[#6B6B6B]">{c.d}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-[1.25rem] font-extrabold mb-6">Report Form</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Report Type</label>
                <select className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none">
                  <option>Fake Seller / Fake Documents</option>
                  <option>Fraud / Scam</option>
                  <option>Abusive Content</option>
                  <option>Spam / Duplicate Account</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">User / Business Name</label>
                <input placeholder="Kisko report kar rahe hain?" className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Your Email</label>
                <input type="email" placeholder="Aapka email" className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Details</label>
                <textarea placeholder="Kya hua, kab hua, kaise hua — detail me likhein..." className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A] min-h-[140px]" />
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold text-[14px]">
                Submit Report
              </button>
              <p className="text-[11px] text-[#6B6B6B] text-center">
                Emergency? WhatsApp: <a href="https://wa.me/919999999999" className="text-[#0A0A0A] font-semibold">+91 9999999999</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
