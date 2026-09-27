import PageHero from "@/components/public/PageHero";

const SECTIONS = [
  { t: "1. Acceptance", c: "Retailers Club use karne ka matlab hai ki aap in terms se agree karte hain. Agar agree nahi karte toh platform use na karein." },
  { t: "2. Eligibility", c: "Aap 18+ hona chahiye aur valid business entity honi chahiye. Fake documents pe account permanently ban hoga." },
  { t: "3. Account Responsibility", c: "Aap apne account credentials ki security ke responsible hain. Unauthorized access hone pe hume turant inform karein." },
  { t: "4. Listing Rules", c: "Sirf apne products list karo. Duplicate, misleading, ya illegal content allowed nahi. Copyright infringement pe listing remove hogi." },
  { t: "5. Transaction Terms", c: "Retailers Club sirf ek marketplace hai — hum buyer aur seller ke beech deal me party nahi hain. Payment, delivery, quality ke disputes buyer-seller ke beech hai." },
  { t: "6. Payments & Fees", c: "Basic features free. Pro subscription ke liye monthly fee. Transaction pe koi commission nahi." },
  { t: "7. Prohibited Activities", c: "Fake reviews, spam messages, harassment, hacking, scrapers, ya illegal activity — sab strictly prohibited. Violation pe account terminate." },
  { t: "8. Content Ownership", c: "Aapke uploaded content ka ownership aapka hai, but platform pe display karne ka license hume milta hai." },
  { t: "9. Verification", c: "Verification admin manual review pe based hai. Approval/rejection ka final decision platform ka hoga." },
  { t: "10. Dispute Resolution", c: "Disputes pehle in-platform resolve karo. Agar resolve na ho toh Indian jurisdiction (Mumbai courts) me settle hoga." },
  { t: "11. Limitation of Liability", c: "Platform ke use se hui indirect losses ke liye hum responsible nahi hain. Direct damages ki max limit ₹10,000 hoga." },
  { t: "12. Termination", c: "Hum kisi bhi account ko terminate kar sakte hain agar ye terms violate karein. Aap bhi apna account delete kar sakte hain." },
  { t: "13. Changes to Terms", c: "Terms update ho sakte hain. Continued use matlab acceptance." },
  { t: "14. Contact", c: "Terms questions: legal@retailersclub.com" },
];

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" subtitle="Last updated: 27 September 2026" />

      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-[14px] text-[#6B6B6B] leading-relaxed bg-[#FBF6EF] border border-[#E8D9BF] rounded-2xl p-5">
            Retailers Club use karne se pehle ye terms dhyan se padh lein. Ye aapke rights aur responsibilities define karti hain.
          </p>

          {SECTIONS.map((s, i) => (
            <div key={i}>
              <h2 className="text-[1.1rem] font-bold">{s.t}</h2>
              <p className="mt-2 text-[14px] text-[#6B6B6B] leading-relaxed">{s.c}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
