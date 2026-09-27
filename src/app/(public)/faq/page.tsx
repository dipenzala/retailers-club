import PageHero from "@/components/public/PageHero";

const FAQS = [
  { c: "General", q: "Retailers Club kya hai?", a: "Retailers Club India ka largest B2B garment marketplace hai jahan verified manufacturers aur retailers ek dusre se connect karke business kar sakte hain. Har transaction secure hai aur koi middleman nahi." },
  { c: "General", q: "Registration free hai?", a: "Haan bilkul free. Basic listing, chat, aur 7-day boost trial sab free me milta hai. Pro features paid hain." },
  { c: "Verification", q: "Verification me kitna time lagta hai?", a: "GST certificate upload karne ke baad 24-48 hours me admin verify kar deta hai. Aapko notification milega email aur dashboard pe." },
  { c: "Verification", q: "Kaunse documents chahiye?", a: "GST certificate (mandatory), PAN card, MSME/Udyam certificate, aur business address proof. Jitne zyada documents verify honge, utna higher tier milega." },
  { c: "Verification", q: "Verified badge kab milega?", a: "GST aur PAN dono approve hone ke baad badge automatically activate ho jaata hai. Aapki profile pe blue tick dikhega." },
  { c: "Products", q: "Kitne products list kar sakte hain?", a: "Free plan me 10 products, Pro plan me unlimited. AI upload feature se ek photo se 30 second me listing ready hoti hai." },
  { c: "Products", q: "Product images/videos kitne upload kar sakte hain?", a: "Ek product me 5 images aur 1 video tak. Carousel format me customer slide karke dekh sakta hai." },
  { c: "Chat", q: "Chat feature kaise kaam karta hai?", a: "Product ya profile page pe 'Inquire' button click karo — direct chat khul jaayegi. Real-time messages, images, aur read receipts." },
  { c: "Chat", q: "Mobile number view karne ka limit?", a: "Ek din me 20 mobile numbers tak view kar sakte hain. Har reveal pe owner ko notification milta hai." },
  { c: "Orders", q: "Order kaise place karein?", a: "Product pe quantity aur address daalo — order create ho jaayega. Manufacturer confirm karega, tum payment karo, aur tracking shuru." },
  { c: "Orders", q: "Payment kaise hoti hai?", a: "Currently Razorpay integration process me hai. Tab tak chat pe discuss karke direct payment kar sakte hain." },
  { c: "Orders", q: "Order cancel kar sakte hain?", a: "Haan, delivered hone se pehle cancel kar sakte hain. Cancellation policy terms me mention hai." },
  { c: "Payments", q: "Kya platform fees hai?", a: "Basic features free hain. Pro plans me monthly subscription hai. Transaction pe koi commission nahi hai." },
  { c: "Privacy", q: "Mera data safe hai?", a: "Bilkul. Har document private storage me hai, sirf admin dekh sakta hai. Public API se mobile number kabhi expose nahi hota." },
  { c: "Privacy", q: "Number dikhana hai ya nahi control kar sakte?", a: "Haan, settings me 'Show Mobile Number' toggle off kar sakte hain. Phir koi number view nahi kar payega." },
];

export default function FAQ() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Jo sab puchte hain — yahan sab answers milenge." />

      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="bg-white border rounded-2xl group open:shadow-md transition">
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8894A] bg-[#FBF6EF] border border-[#E8D9BF] rounded-full px-2 py-0.5 shrink-0">
                    {f.c}
                  </span>
                  <span className="text-[14px] font-bold">{f.q}</span>
                </div>
                <span className="text-[#9B9B9B] text-[20px] group-open:rotate-45 transition shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 text-[13px] text-[#6B6B6B] leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
