"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    business_name: "",
    city: "",
    role: "retailer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const register = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setLoading(false);
      return setError(authError.message);
    }

    if (data.user) {
      // Update profile with business info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: form.role,
          business_name: form.business_name,
          city: form.city,
        })
        .eq("id", data.user.id);

      if (profileError) console.error("Profile update:", profileError.message);
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#FAFAF9]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E7E5E4] rounded-2xl p-8 w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[15px]">Retailers Club</span>
        </Link>
        <h1 className="text-[1.5rem] font-extrabold text-center text-[#0A0A0A] tracking-tight">
          Create account
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { k: "retailer", l: "Retailer" },
            { k: "manufacturer", l: "Manufacturer" },
          ].map((r) => (
            <button
              key={r.k}
              onClick={() => setForm({ ...form, role: r.k })}
              className={`rounded-xl p-4 text-center transition border ${
                form.role === r.k
                  ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                  : "border-[#E7E5E4] bg-[#FAFAF9] text-[#0A0A0A]"
              }`}
            >
              <span className="text-[14px] font-semibold">{r.l}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <input
            placeholder="Business Name"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[14px]"
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[14px]"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[14px]"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[14px]"
          />
          <button
            onClick={register}
            disabled={!form.email || form.password.length < 6 || loading}
            className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0A0A0A] font-semibold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
