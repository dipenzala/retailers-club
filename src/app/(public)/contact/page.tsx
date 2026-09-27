import PageHero from "@/components/public/PageHero";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in Touch" subtitle="Hum 24 ghante me respond karte hain — usually much faster." />

      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-[1.5rem] font-extrabold mb-6">Reach Us</h2>
            {[
              { i: Mail, t: "Email", v: "hello@retailersclub.com", href: "mailto:hello@retailersclub.com" },
              { i: Phone, t: "Phone", v: "+91 9999999999", href: "tel:+919999999999" },
              { i: MessageCircle, t: "WhatsApp", v: "+91 9999999999", href: "https://wa.me/919999999999" },
              { i: MapPin, t: "Office", v: "Mumbai, Maharashtra, India" },
            ].map((c) => (
              <a key={c.t} href={c.href || "#"} className="block bg-white border rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FAFAF9] border flex items-center justify-center shrink-0">
                    <c.i size={18} className="text-[#B8894A]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-semibold uppercase tracking-wider">{c.t}</div>
                    <div className="mt-1 text-[14px] font-bold">{c.v}</div>
                  </div>
                </div>
              </a>
            ))}

            <div className="mt-8 pt-6 border-t">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-3">Business Hours</div>
              <div className="text-[13px] text-[#6B6B6B] space-y-1">
                <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                <div>Saturday: 10:00 AM - 4:00 PM</div>
                <div>Sunday: Closed</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-[1.5rem] font-extrabold mb-6">Send Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Your Name</label>
                <input placeholder="Full name" className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Subject</label>
                <input placeholder="Kya help chahiye?" className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A]" />
              </div>
              <div>
                <label className="text-[12px] font-semibold block mb-1.5">Message</label>
                <textarea placeholder="Apna message likhein..." className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A0A0A] min-h-[120px]" />
              </div>
              <button className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
