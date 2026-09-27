import PageHero from "@/components/public/PageHero";

const SECTIONS = [
  { t: "1. Information We Collect", c: "Hum ye info collect karte hain: business name, phone, email, address, GST/PAN details (verification ke liye), product images, chat messages, aur usage data. Yeh sab aapki identity aur verification ke liye zaroori hai." },
  { t: "2. How We Use Your Data", c: "Aapka data use hota hai: account manage karne, verification process, product listings dikhane, chat enable karne, notification bhejne, fraud prevent karne, aur platform improve karne ke liye. Kisi third-party ko sell nahi karte." },
  { t: "3. Document Storage", c: "Verification documents (GST, PAN, MSME) private encrypted storage me hain. Sirf admin hi dekh sakta hai. Kabhi public nahi hote. Signed URLs ke through securely access hote hain." },
  { t: "4. Mobile Number Privacy", c: "Aapka mobile number default masked (+91 XXXXX XXXXX) hai. 'View Number' button se koi reveal kar sakta hai, but tab aapko notification milega. Daily limit 20 hai. Aap show_number toggle off kar sakte hain." },
  { t: "5. Data Sharing", c: "Hum aapka data sirf ye log ke saath share karte hain: Supabase (database), Vercel (hosting), Cloudflare (CDN), OpenAI (AI features — anonymous data). Legal requirement ho toh authorities ke saath." },
  { t: "6. Cookies", c: "Hum cookies use karte hain login session aur preferences ke liye. Analytics cookies bhi hai but aap disable kar sakte hain." },
  { t: "7. Your Rights", c: "Aap apna data access, edit, ya delete kar sakte hain. Account delete karne pe 30 din me sab data permanently delete ho jaata hai (except legal-required records)." },
  { t: "8. Security", c: "End-to-end encryption, RLS, secure APIs, aur regular audits. Har admin action logged hai." },
  { t: "9. Children's Privacy", c: "Platform 18+ businesses ke liye hai. Koi minor ka data knowingly collect nahi karte." },
  { t: "10. Changes to Policy", c: "Policy update hone pe email notification milega. Continued use matlab acceptance." },
  { t: "11. Contact", c: "Privacy questions: privacy@retailersclub.com" },
];

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: 27 September 2026" />

      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-[14px] text-[#6B6B6B] leading-relaxed bg-[#FBF6EF] border border-[#E8D9BF] rounded-2xl p-5">
            Retailers Club aapki privacy ka pura respect karta hai. Ye policy batati hai ki hum kaunsa data collect karte hain, kaise use karte hain, aur aapke rights kya hain.
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
