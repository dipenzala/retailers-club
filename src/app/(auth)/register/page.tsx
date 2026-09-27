"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, Phone, User, Building2, Store } from "lucide-react";

function RegisterInner() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"manufacturer"|"retailer">("retailer");
  const [form, setForm] = useState({ email: "", password: "", business_name: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const urlRole = params.get("role");
  if (urlRole === "manufacturer" || urlRole === "retailer") {
    if (role !== urlRole) setRole(urlRole);
  }

  const submit = async () => {
    setLoading(true); setError("");
    const sb = createClient();
    const { data, error: authError } = await sb.auth.signUp({ email: form.email, password: form.password });
    if (authError) { setLoading(false); return setError(authError.message); }

    if (data.user) {
      await sb.from("profiles").update({
        role, business_name: form.business_name, city: form.city,
      }).eq("id", data.user.id);

      // Check referral
      const ref = params.get("ref");
      if (ref) {
        await sb.from("profiles").update({ referred_by: null }).eq("id", data.user.id);
      }
    }
    setLoading(false);
    router.push("/feed");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-10 px-5">
      <div className="max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-extrabold">Retailers Club</span>
        </Link>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className={step >= 1 ? "text-[#0A0A0A]" : "text-[#9B9B9B]"}>1. Role</span>
            <span className={step >= 2 ? "text-[#0A0A0A]" : "text-[#9B9B9B]"}>2. Details</span>
          </div>
          <div className="mt-2 flex gap-1">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-[#0A0A0A]" : "bg-[#E7E5E4]"}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-[#0A0A0A]" : "bg-[#E7E5E4]"}`} />
          </div>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white border rounded-2xl p-8">
          {step === 1 && (
            <>
              <h1 className="text-[1.35rem] font-extrabold text-center">Aap kaun hain?</h1>
              <p className="text-[13px] text-[#6B6B6B] text-center mt-2">Select your role to continue</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: "manufacturer", icon: Building2, l: "Manufacturer", d: "Products bechte hain" },
                  { k: "retailer", icon: Store, l: "Retailer", d: "Products kharidte hain" },
                ].map((r) => (
                  <button key={r.k} onClick={() => setRole(r.k as any)}
                    className={`p-5 rounded-2xl border-2 transition text-center ${
                      role === r.k ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E7E5E4] bg-white"
                    }`}>
                    <r.icon size={28} className="mx-auto" />
                    <div className="mt-3 text-[14px] font-bold">{r.l}</div>
                    <div className={`text-[11px] mt-1 ${role === r.k ? "text-white/60" : "text-[#6B6B6B]"}`}>{r.d}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)}
                className="mt-6 w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px]">
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[1.35rem] font-extrabold text-center">Business Details</h1>
              <p className="text-[13px] text-[#6B6B6B] text-center mt-2">Just 4 fields — 30 seconds</p>
              <div className="mt-6 space-y-3">
                <input placeholder="Business Name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3.5 outline-none text-[14px]" />
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3.5 outline-none text-[14px]" />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3.5 outline-none text-[14px]" />
                <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3.5 outline-none text-[14px]" />
              </div>
              {error && <div className="mt-4 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
              <div className="mt-5 flex gap-2">
                <button onClick={() => setStep(1)} className="px-4 bg-[#FAFAF9] border rounded-xl font-semibold text-[14px]">Back</button>
                <button onClick={submit} disabled={loading || !form.email || form.password.length < 6 || !form.business_name}
                  className="flex-1 bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Create Account"}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E7E5E4]" />
                <span className="text-[11px] text-[#9B9B9B]">OR</span>
                <div className="flex-1 h-px bg-[#E7E5E4]" />
              </div>
              <button disabled className="mt-4 w-full border-2 border-[#E7E5E4] py-3 rounded-xl font-semibold text-[13px] text-[#9B9B9B]">
                Continue with Google (Setup required)
              </button>
            </>
          )}

          <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
            Already have an account? <Link href="/login" className="text-[#0A0A0A] font-semibold">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function Register() {
  return <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}><RegisterInner /></Suspense>;
}
