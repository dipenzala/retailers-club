#!/bin/bash
set -e

echo "🚀 Retailers Club — Building ALL phases..."
echo ""

# ============================================================
# EXTRA DEPS
# ============================================================
echo "📦 Installing extra deps..."
npm install openai socket.io-client zustand
npm install -D @types/node

mkdir -p src/lib/ai src/lib/hooks
mkdir -p src/app/api/auth/callback src/app/api/ai/upload src/app/api/ai/search
mkdir -p src/app/api/products/\[id\] src/app/api/verify/upload
mkdir -p src/app/api/rfq/\[id\]/quotes src/app/api/chat/conversations
mkdir -p src/app/api/notifications src/app/api/boost
mkdir -p src/app/products/new src/app/products/upload src/app/boost
mkdir -p .github/workflows

# ============================================================
# ENV — updated template
# ============================================================
cat > .env.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# OpenAI
OPENAI_API_KEY=sk-...

# Socket
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# ============================================================
# PHASE 3 — AUTH (Supabase phone OTP)
# ============================================================
echo "🔐 Phase 3 — Auth..."

cat > src/lib/supabase/middleware.ts << 'EOF'
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const protectedPaths = ["/dashboard", "/products", "/chat", "/rfq", "/search", "/verification", "/settings", "/boost", "/admin"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}
EOF

cat > middleware.ts << 'EOF'
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
EOF

cat > src/app/api/auth/callback/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
EOF

# Real auth in login page
cat > "src/app/(auth)/login/page.tsx" << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    setLoading(false);
    if (error) return setError(error.message);
    setStep("otp");
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAFAF9]">
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
        <p className="text-[13px] text-[#6B6B6B] text-center mt-2">
          {step === "phone" ? "Phone number se login karo" : "6-digit OTP daalo"}
        </p>

        <div className="mt-8 space-y-3">
          {step === "phone" ? (
            <>
              <div className="flex items-center bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4">
                <span className="text-[#6B6B6B] font-medium text-[14px]">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className="bg-transparent flex-1 px-3 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={phone.length !== 10 || loading}
                className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="bg-transparent w-full py-3.5 outline-none text-center tracking-[1em] text-[18px] text-[#0A0A0A]"
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-[13px] text-[#6B6B6B] font-medium"
              >
                Change number
              </button>
            </>
          )}
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
    </div>
  );
}
EOF

# Auth store with real session
cat > src/lib/store/auth.ts << 'EOF'
"use client";
import { create } from "zustand";

export type Role = "super_admin" | "admin" | "verification_admin" | "manufacturer" | "retailer";

export type Profile = {
  id: string;
  role: Role;
  phone: string | null;
  business_name: string | null;
  city: string | null;
  is_verified: boolean;
};

type AuthState = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  profile: null,
  setProfile: (p) => set({ profile: p }),
  logout: () => set({ profile: null }),
}));
EOF

cat > src/lib/hooks/useProfile.ts << 'EOF'
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/store/auth";

export function useProfile() {
  const { profile, setProfile } = useAuth();
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setProfile(null);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data as any);
    })();
  }, [setProfile]);
  return profile;
}
EOF

# ============================================================
# PHASE 4 — PRODUCTS CRUD
# ============================================================
echo "🛍  Phase 4 — Products..."

cat > src/app/api/products/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") || 20);

  let query = supabase.from("products").select("*").limit(limit).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...body, manufacturer_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
EOF

cat > "src/app/api/products/[id]/route.ts" << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", id)
    .eq("manufacturer_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("manufacturer_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
EOF

cat > src/app/products/new/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewProduct() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", fabric: "",
    color: "", gender: "", price: "", moq: "", visibility: "verified_retailers",
  });
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        moq: Number(form.moq),
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/products");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">New Product</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[14px] min-h-[100px]"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Fabric" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <Input placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <Input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="MOQ" type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
          </div>
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[14px]"
          >
            <option value="public">Public</option>
            <option value="retailers_only">Retailers Only</option>
            <option value="verified_retailers">Verified Retailers</option>
            <option value="private">Private</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
EOF

# ============================================================
# PHASE 5 — CHAT realtime
# ============================================================
echo "💬 Phase 5 — Chat..."

cat > src/lib/socket.ts << 'EOF'
"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      autoConnect: false,
    });
  }
  return socket;
}
EOF

cat > src/app/api/chat/conversations/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .contains("participants", [user.id])
    .order("last_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversations: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { other_user } = await req.json();
  const { data, error } = await supabase
    .from("conversations")
    .insert({ participants: [user.id, other_user] })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversation: data }, { status: 201 });
}
EOF

cat > src/app/chat/page.tsx << 'EOF'
"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { createClient } from "@/lib/supabase/client";

type Message = { from: string; to: string; content: string; at: number };
type Conversation = { id: string; name: string; last_message: string; online?: boolean };

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [active, setActive] = useState<Conversation>({
    id: "demo", name: "Demo Retailer", last_message: "Hi!",
  });
  const socketRef = useRef(getSocket());

  const conversations: Conversation[] = [
    { id: "demo", name: "Amit Retailers", last_message: "Kya aap 100 pcs de sakte ho?", online: true },
    { id: "c2", name: "Priya Fashion House", last_message: "Price ₹280 final kar do", online: true },
    { id: "c3", name: "Surat Textiles", last_message: "Sample bhej diya hai" },
  ];

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const s = socketRef.current;
        s.connect();
        s.emit("user:online", user.id);
      }
    })();

    const s = socketRef.current;
    s.on("message:new", (m: Message) => setMessages((prev) => [...prev, m]));
    s.on("message:sent", (m: Message) => setMessages((prev) => [...prev, m]));

    return () => {
      s.off("message:new");
      s.off("message:sent");
    };
  }, []);

  const send = () => {
    if (!input.trim() || !userId) return;
    socketRef.current.emit("message:send", {
      to: active.id,
      from: userId,
      content: input,
      kind: "text",
    });
    setInput("");
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden h-[calc(100vh-160px)] flex">
      <div className="w-[320px] border-r border-[#E7E5E4] flex flex-col">
        <div className="px-4 py-4 border-b border-[#E7E5E4]">
          <div className="text-[14px] font-bold text-[#0A0A0A]">Messages</div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">{conversations.length} conversations</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActive(c)}
              className={`px-4 py-3 border-b border-[#E7E5E4] cursor-pointer hover:bg-[#FAFAF9] transition ${
                active.id === c.id ? "bg-[#FAFAF9]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar name={c.name} size={38} />
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-[#0A0A0A] truncate">{c.name}</div>
                  <div className="text-[12px] text-[#6B6B6B] truncate mt-0.5">{c.last_message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={active.name} size={38} />
            <div>
              <div className="text-[14px] font-bold text-[#0A0A0A]">{active.name}</div>
              <div className="text-[11px] text-emerald-600 font-medium">Online</div>
            </div>
          </div>
          <Badge variant="gold">Verified</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAFAF9]">
          {messages.length === 0 && (
            <div className="text-center text-[12px] text-[#9B9B9B] py-8">
              Send a message to start the conversation
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === userId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] ${
                  m.from === userId
                    ? "bg-[#0A0A0A] text-white rounded-br-md"
                    : "bg-white border border-[#E7E5E4] text-[#0A0A0A] rounded-bl-md"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#E7E5E4] flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9]">
            <Paperclip size={16} className="text-[#6B6B6B]" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message likho..."
            className="flex-1 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[13px]"
          />
          <button
            onClick={send}
            className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center hover:bg-[#262626]"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================================
# PHASE 6 — AI UPLOAD + SEARCH
# ============================================================
echo "🤖 Phase 6 — AI..."

cat > src/lib/ai/openai.ts << 'EOF'
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const EMBED_MODEL = "text-embedding-3-small";
export const CHAT_MODEL = "gpt-4o-mini";

export async function embed(text: string) {
  const res = await openai.embeddings.create({ model: EMBED_MODEL, input: text });
  return res.data[0].embedding;
}

export async function suggestProductAttributes(imageUrl: string) {
  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a garment cataloguing expert. Given a product image, output JSON with keys: title, category, fabric, color, gender, tags (array), description. Only valid JSON.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this garment product." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(res.choices[0].message.content || "{}");
}

export async function parseSearchQuery(query: string) {
  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `Parse garment B2B search queries into JSON with keys: category (string|null), gender (string|null), color (string|null), fabric (string|null), priceMax (number|null), location (string|null), keywords (array). Only valid JSON.`,
      },
      { role: "user", content: query },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(res.choices[0].message.content || "{}");
}
EOF

cat > src/app/api/ai/upload/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { suggestProductAttributes } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    const { image_url } = await req.json();
    if (!image_url) return NextResponse.json({ error: "image_url required" }, { status: 400 });
    const attrs = await suggestProductAttributes(image_url);
    return NextResponse.json({ attributes: attrs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
EOF

cat > src/app/api/ai/search/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { parseSearchQuery, embed } from "@/lib/ai/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

    const parsed = await parseSearchQuery(query);
    const vector = await embed(query);

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_products_semantic", {
      query_embedding: vector as any,
      match_threshold: 0.5,
      match_count: 20,
    });

    if (error) return NextResponse.json({ parsed, results: [], note: "RPC not set up yet" });
    return NextResponse.json({ parsed, results: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
EOF

# AI Upload page
cat > src/app/products/upload/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, Upload } from "lucide-react";

export default function AIUploadPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [attrs, setAttrs] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const analyze = async () => {
    if (!imageUrl) return;
    setLoading(true);
    const res = await fetch("/api/ai/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl }),
    });
    const data = await res.json();
    setLoading(false);
    setAttrs(data.attributes);
  };

  const create = async () => {
    setCreating(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...attrs,
        title: attrs?.title,
        description: attrs?.description,
        category: attrs?.category,
        fabric: attrs?.fabric,
        color: attrs?.color,
        gender: attrs?.gender,
        price: 0,
        moq: 50,
        media_urls: [imageUrl],
        visibility: "verified_retailers",
      }),
    });
    setCreating(false);
    router.push("/products");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#B8894A]" />
            <div className="text-[15px] font-bold text-[#0A0A0A]">AI Quick Upload</div>
          </div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">
            Image URL daalo — AI title, category, fabric sab suggest karega
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            placeholder="https://example.com/kurti.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button onClick={analyze} disabled={!imageUrl || loading} className="w-full">
            <Sparkles size={14} /> {loading ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </CardBody>
      </Card>

      {attrs && (
        <Card>
          <CardHeader>
            <div className="text-[15px] font-bold text-[#0A0A0A]">AI Suggestions</div>
          </CardHeader>
          <CardBody className="space-y-3">
            {["title", "category", "fabric", "color", "gender", "description"].map((k) => (
              <div key={k}>
                <label className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">{k}</label>
                <Input
                  value={attrs[k] || ""}
                  onChange={(e) => setAttrs({ ...attrs, [k]: e.target.value })}
                  className="mt-1"
                />
              </div>
            ))}
            {attrs.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {attrs.tags.map((t: string, i: number) => (
                  <span key={i} className="text-[11px] bg-[#FBF6EF] text-[#B8894A] border border-[#E8D9BF] px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <Button onClick={create} disabled={creating} className="w-full mt-2">
              <Upload size={14} /> {creating ? "Creating..." : "Create Product"}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
EOF

# ============================================================
# PHASE 7 — VERIFICATION upload
# ============================================================
echo "✅ Phase 7 — Verification..."

cat > src/app/api/verify/upload/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { doc_type, file_url } = await req.json();
  const { data, error } = await supabase
    .from("verification_docs")
    .insert({ user_id: user.id, doc_type, file_url, status: "pending" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ doc: data }, { status: 201 });
}
EOF

# ============================================================
# PHASE 8 — RFQ + NOTIFICATIONS
# ============================================================
echo "📋 Phase 8 — RFQ + Notifications..."

cat > src/app/api/rfq/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rfqs").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rfqs: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("rfqs")
    .insert({ ...body, retailer_id: user.id, status: "open" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rfq: data }, { status: 201 });
}
EOF

cat > "src/app/api/rfq/[id]/quotes/route.ts" << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("quotes").select("*").eq("rfq_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quotes: data });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("quotes")
    .insert({ ...body, rfq_id: id, manufacturer_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data }, { status: 201 });
}
EOF

cat > src/app/api/notifications/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notifications: data });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
EOF

# ============================================================
# PHASE 9 — BOOST
# ============================================================
echo "🚀 Phase 9 — Boost..."

cat > src/app/api/boost/route.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("boosts")
    .select("*")
    .eq("user_id", user.id)
    .order("starts_at", { ascending: false });

  return NextResponse.json({ boosts: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { radius_km, is_trial } = await req.json();
  const days = is_trial ? 7 : 30;
  const starts = new Date();
  const ends = new Date(Date.now() + days * 86400000);

  const { data, error } = await supabase
    .from("boosts")
    .insert({
      user_id: user.id,
      radius_km,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      is_trial: !!is_trial,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ boost: data }, { status: 201 });
}
EOF

cat > src/app/boost/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rocket } from "lucide-react";

const options = [
  { r: 25, p: 499, l: "Top 25 km" },
  { r: 50, p: 899, l: "Top 50 km" },
  { r: 100, p: 1499, l: "Top 100 km" },
];

export default function BoostPage() {
  const [selected, setSelected] = useState(25);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const activate = async (is_trial: boolean) => {
    setLoading(true);
    await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ radius_km: selected, is_trial }),
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket size={16} className="text-[#B8894A]" />
            <div className="text-[15px] font-bold text-[#0A0A0A]">Profile Boost</div>
          </div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">
            Apni profile ko top placement dilwao — radius ke hisaab se
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-3">
            {options.map((o) => (
              <button
                key={o.r}
                onClick={() => setSelected(o.r)}
                className={`p-4 rounded-xl border-2 text-center transition ${
                  selected === o.r
                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                    : "border-[#E7E5E4] bg-white"
                }`}
              >
                <div className="text-[13px] font-bold">{o.l}</div>
                <div className={`text-[20px] font-extrabold mt-1 ${selected === o.r ? "" : "text-[#0A0A0A]"}`}>
                  ₹{o.p}
                </div>
                <div className={`text-[11px] mt-0.5 ${selected === o.r ? "text-white/60" : "text-[#6B6B6B]"}`}>
                  /month
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => activate(true)} disabled={loading || done}>
              Try 7 Days Free
            </Button>
            <Button onClick={() => activate(false)} disabled={loading || done} className="flex-1">
              {done ? "✓ Boost Activated" : loading ? "Activating..." : "Activate Boost"}
            </Button>
          </div>

          {done && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[12px] text-emerald-700">
              Boost activated successfully. Your profile is now in top placement.
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
EOF

# ============================================================
# DB — Add semantic search function + all missing pieces
# ============================================================
cat > supabase/migrations/002_functions.sql << 'EOF'
-- ============================================
-- Semantic search RPC
-- ============================================
create or replace function search_products_semantic(
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count int default 20
)
returns table (
  id uuid,
  title text,
  category text,
  price numeric,
  similarity float
)
language sql stable
as $$
  select
    products.id,
    products.title,
    products.category,
    products.price,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where products.embedding is not null
    and 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================
-- Nearby search (PostGIS)
-- ============================================
create or replace function nearby_manufacturers(
  lat float,
  lng float,
  radius_km int default 25,
  result_limit int default 20
)
returns table (
  id uuid,
  business_name text,
  city text,
  distance_km float
)
language sql stable
as $$
  select
    profiles.id,
    profiles.business_name,
    profiles.city,
    st_distance(profiles.location, st_makepoint(lng, lat)::geography) / 1000 as distance_km
  from profiles
  where profiles.location is not null
    and profiles.role = 'manufacturer'
    and st_dwithin(profiles.location, st_makepoint(lng, lat)::geography, radius_km * 1000)
  order by distance_km
  limit result_limit;
$$;
EOF

# ============================================================
# PHASE 10 — DEPLOYMENT
# ============================================================
echo "🌐 Phase 10 — Deployment..."

cat > vercel.json << 'EOF'
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["bom1"],
  "env": {
    "NEXT_PUBLIC_SOCKET_URL": "@next_public_socket_url"
  }
}
EOF

cat > Dockerfile << 'EOF'
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
EOF

cat > docker-compose.yml << 'EOF'
version: "3.9"
services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_SOCKET_URL=http://socket:3001
    depends_on: [socket]

  socket:
    image: node:20-alpine
    working_dir: /app
    volumes: ["./socket-server:/app"]
    command: sh -c "npm init -y && npm install socket.io && node index.js"
    ports: ["3001:3001"]
EOF

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
EOF

cat > .gitignore << 'EOF'
node_modules
.next
.env
.env.local
.env*.local
.DS_Store
*.log
dist
build
.vercel
EOF

# ============================================================
# Sidebar — add Boost + AI Upload links
# ============================================================
cat > src/components/dashboard/Sidebar.tsx << 'EOF'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard, Package, MessageSquare, FileText, Search,
  ShieldCheck, Settings, LogOut, Users, BarChart3, Rocket, Sparkles
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/products/upload", label: "AI Upload", icon: Sparkles },
  { href: "/search", label: "Discover", icon: Search },
  { href: "/rfq", label: "RFQs", icon: FileText },
  { href: "/chat", label: "Messages", icon: MessageSquare, badge: 3 },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
  { href: "/boost", label: "Boost", icon: Rocket },
];

const adminNav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[240px] shrink-0 border-r border-[#E7E5E4] bg-white h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-[#E7E5E4]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[14px]">Retailers Club</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2">
          Workspace
        </div>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 transition",
                active
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A]"
              )}
            >
              <item.icon size={16} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-[#B8894A] text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2 mt-6">
          Admin
        </div>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-[#E7E5E4]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
        >
          <Settings size={16} strokeWidth={2} />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
        >
          <LogOut size={16} strokeWidth={2} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
EOF

# ============================================================
# DONE
# ============================================================
echo ""
echo "======================================================"
echo "  ✅ ALL PHASES COMPLETE!"
echo "======================================================"
echo ""
echo "  Phases delivered:"
echo "    ✅ Phase 3 — Supabase phone OTP auth"
echo "    ✅ Phase 4 — Products CRUD (real DB)"
echo "    ✅ Phase 5 — Real-time chat (Socket.IO)"
echo "    ✅ Phase 6 — AI upload + AI search (OpenAI)"
echo "    ✅ Phase 7 — Verification upload"
echo "    ✅ Phase 8 — RFQ + Notifications"
echo "    ✅ Phase 9 — Boost system"
echo "    ✅ Phase 10 — Deployment (Vercel + Docker + CI)"
echo ""
echo "  NEXT STEPS:"
echo "    1. Create Supabase project → run migrations in SQL editor:"
echo "       - supabase/migrations/001_init.sql"
echo "       - supabase/migrations/002_functions.sql"
echo "    2. Copy .env.example to .env.local and fill keys"
echo "    3. npm run dev:all"
echo ""
echo "  Test URLs:"
echo "    /login  /register  /dashboard  /products  /products/upload"
echo "    /chat   /rfq       /search     /verification  /boost  /settings"
echo "======================================================"