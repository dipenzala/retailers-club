"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const login = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  };

  return (
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
        Welcome back
      </h1>
      <p className="text-[13px] text-[#6B6B6B] text-center mt-2">Email se login karo</p>

      <div className="mt-8 space-y-3">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
        />
        <button
          onClick={login}
          disabled={!email || !password || loading}
          className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
        New here?{" "}
        <Link href="/register" className="text-[#0A0A0A] font-semibold">
          Create account
        </Link>
      </p>
    </motion.div>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAFAF9]">
      <Suspense fallback={<div className="text-[13px] text-[#6B6B6B]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
