#!/bin/bash
set -e

echo "🚀 Wiring 6 core features (REAL WORKING CODE)..."

mkdir -p src/app/products/\[id\] src/app/rfq/new
mkdir -p src/app/api/rfq/new
mkdir -p src/app/api/verify/upload
mkdir -p src/lib/hooks

# ============================================================
# 1. PRODUCTS — Real DB
# ============================================================

cat > src/app/products/page.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  moq: number;
  visibility: string;
  media_urls: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">
            <Filter size={15} /> Filters
          </Button>
          <div className="flex gap-2">
            <Badge>All</Badge>
            <Badge>Active</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/products/upload">
            <Button variant="secondary" size="md">
              <Upload size={15} /> AI Upload
            </Button>
          </Link>
          <Link href="/products/new">
            <Button size="md">
              <Plus size={15} /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#6B6B6B]" size={24} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-[15px] font-bold text-[#0A0A0A]">No products yet</div>
          <div className="text-[13px] text-[#6B6B6B] mt-1">
            Create your first product to get started
          </div>
          <Link href="/products/new">
            <Button className="mt-4">
              <Plus size={15} /> Create Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition cursor-pointer">
                <div className="aspect-[4/5] bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative">
                  {p.media_urls?.[0] && (
                    <img
                      src={p.media_urls[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge variant="success" className="absolute top-3 left-3">
                    {p.visibility}
                  </Badge>
                </div>
                <CardBody className="!p-4">
                  <div className="text-[11px] text-[#6B6B6B] font-semibold">
                    {p.category || "General"}
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-[#0A0A0A] line-clamp-1">
                    {p.title}
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[15px] font-extrabold text-[#0A0A0A]">
                        ₹{p.price || 0}
                      </div>
                      <div className="text-[11px] text-[#6B6B6B]">MOQ {p.moq || 0}</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# Product Detail
cat > "src/app/products/[id]/page.tsx" << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setLoading(false);
      });
  }, [id]);

  const startChat = async () => {
    if (!product) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: conv } = await supabase
      .from("conversations")
      .insert({ participants: [user.id, product.manufacturer_id] })
      .select()
      .single();

    if (conv) router.push(`/chat?c=${conv.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4]">
            {product.media_urls?.[0] && (
              <img src={product.media_urls[0]} alt={product.title} className="w-full h-full object-cover" />
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <div>
            <Badge variant="gold">{product.category || "General"}</Badge>
            <h1 className="text-[1.5rem] font-extrabold text-[#0A0A0A] mt-3">{product.title}</h1>
            <p className="text-[13px] text-[#6B6B6B] mt-2">{product.description}</p>
          </div>

          <Card>
            <CardBody>
              <div className="flex items-baseline justify-between">
                <div className="text-[2rem] font-extrabold text-[#0A0A0A]">₹{product.price}</div>
                <div className="text-[13px] text-[#6B6B6B]">MOQ {product.moq} pcs</div>
              </div>
              <div className="mt-4 space-y-1.5 text-[13px] text-[#6B6B6B]">
                {product.fabric && <div>Fabric: {product.fabric}</div>}
                {product.color && <div>Color: {product.color}</div>}
                {product.gender && <div>Gender: {product.gender}</div>}
              </div>
              <Button onClick={startChat} className="w-full mt-5">
                <MessageSquare size={15} /> Chat with Manufacturer
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================================
# 2. CHAT — Supabase Realtime (Vercel compatible)
# ============================================================

cat > src/app/chat/page.tsx << 'EOF'
"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Message = { id: string; sender_id: string; content: string; created_at: string };
type Conversation = { id: string; participants: string[]; last_message: string | null };

function ChatInner() {
  const params = useSearchParams();
  const convId = params.get("c");
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(convId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: convs } = await supabase
        .from("conversations")
        .select("*")
        .contains("participants", [user.id])
        .order("last_at", { ascending: false });

      setConversations(convs || []);
      if (!activeId && convs && convs.length > 0) setActiveId(convs[0].id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const supabase = createClient();

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    const channel = supabase
      .channel(`messages:${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !userId || !activeId) return;
    const supabase = createClient();
    const content = input;
    setInput("");
    await supabase.from("messages").insert({
      conversation_id: activeId,
      sender_id: userId,
      content,
      kind: "text",
    });
    await supabase
      .from("conversations")
      .update({ last_message: content, last_at: new Date().toISOString() })
      .eq("id", activeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-160px)]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-2xl p-20 text-center">
        <div className="text-[15px] font-bold text-[#0A0A0A]">No conversations yet</div>
        <div className="text-[13px] text-[#6B6B6B] mt-1">
          Start a chat from any product page
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden h-[calc(100vh-160px)] flex">
      <div className="w-[320px] border-r border-[#E7E5E4] flex flex-col">
        <div className="px-4 py-4 border-b border-[#E7E5E4]">
          <div className="text-[14px] font-bold text-[#0A0A0A]">Messages</div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">{conversations.length} conversations</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const other = c.participants.find((p) => p !== userId) || "User";
            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-4 py-3 border-b border-[#E7E5E4] cursor-pointer hover:bg-[#FAFAF9] transition ${
                  activeId === c.id ? "bg-[#FAFAF9]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={other} size={38} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#0A0A0A] truncate">
                      {other.slice(0, 8)}...
                    </div>
                    <div className="text-[12px] text-[#6B6B6B] truncate mt-0.5">
                      {c.last_message || "No messages yet"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-5 py-4 border-b border-[#E7E5E4]">
          <div className="text-[14px] font-bold text-[#0A0A0A]">Chat</div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAFAF9]">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] ${
                  m.sender_id === userId
                    ? "bg-[#0A0A0A] text-white rounded-br-md"
                    : "bg-white border border-[#E7E5E4] rounded-bl-md"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-[#E7E5E4] flex gap-2">
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

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" /></div>}>
      <ChatInner />
    </Suspense>
  );
}
EOF

# ============================================================
# 3. RFQ — Real DB
# ============================================================

cat > src/app/rfq/page.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

type RFQ = {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  delivery_days: number;
  status: string;
};

const variantMap: Record<string, "success" | "warning" | "info"> = {
  open: "success",
  quoted: "info",
  closed: "warning",
};

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rfq")
      .then((r) => r.json())
      .then((d) => {
        setRfqs(d.rfqs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-[#6B6B6B]">
          Post your requirement — manufacturers send quotes
        </div>
        <Link href="/rfq/new">
          <Button size="md">
            <Plus size={15} /> Post New RFQ
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-[15px] font-bold text-[#0A0A0A]">No RFQs yet</div>
          <div className="text-[13px] text-[#6B6B6B] mt-1">Post your first requirement</div>
          <Link href="/rfq/new">
            <Button className="mt-4">
              <Plus size={15} /> Post RFQ
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rfqs.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#0A0A0A]">{r.title}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-0.5">{r.category}</div>
                  </div>
                  <Badge variant={variantMap[r.status] || "info"}>{r.status}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Quantity</div>
                    <div className="mt-1 text-[15px] font-extrabold">{r.quantity}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Budget</div>
                    <div className="mt-1 text-[15px] font-extrabold">₹{r.budget}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Delivery</div>
                    <div className="mt-1 text-[15px] font-extrabold">{r.delivery_days}d</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/app/rfq/new/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewRFQ() {
  const [form, setForm] = useState({
    title: "", category: "", quantity: "", budget: "", delivery_days: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        budget: Number(form.budget),
        delivery_days: Number(form.delivery_days),
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/rfq");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">Post New RFQ</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">
            Apni requirement post karo — manufacturers quotes bhejenge
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title (e.g., Cotton Kurti 100 pcs)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Input placeholder="Budget ₹" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <Input placeholder="Delivery days" type="number" value={form.delivery_days} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !form.title}>
              {loading ? "Posting..." : "Post RFQ"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
EOF

# ============================================================
# 4. VERIFICATION — File upload to Storage
# ============================================================

cat > src/app/verification/page.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Upload, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const docTypes = [
  { k: "gst", l: "GST Certificate" },
  { k: "msme", l: "MSME / Udyam" },
  { k: "pan", l: "PAN Card" },
  { k: "address", l: "Business Address Proof" },
];

const variantMap: Record<string, "success" | "warning" | "danger"> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

export default function VerificationPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const loadDocs = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);
    const { data } = await supabase.from("verification_docs").select("*").eq("user_id", user.id);
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { loadDocs(); }, []);

  const upload = async (docType: string, file: File) => {
    setUploading(docType);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setUploading(null);

    const path = `${user.id}/${docType}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("verification-docs")
      .upload(path, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(null);
      return;
    }

    await supabase.from("verification_docs").insert({
      user_id: user.id,
      doc_type: docType,
      file_url: path,
      status: "pending",
    });

    setUploading(null);
    loadDocs();
  };

  const getDocStatus = (docType: string) => {
    const doc = docs.find((d) => d.doc_type === docType);
    return doc ? doc.status : null;
  };

  const approved = docs.filter((d) => d.status === "approved").length;
  const progress = (approved / docTypes.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FBF6EF] border border-[#E8D9BF] flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#B8894A]" />
            </div>
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-[#0A0A0A]">Verification Status</div>
              <div className="text-[13px] text-[#6B6B6B] mt-1">
                {approved} of {docTypes.length} documents verified
              </div>
              <div className="mt-4 w-full h-2 bg-[#FAFAF9] rounded-full overflow-hidden">
                <div className="h-full bg-[#B8894A] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 text-[12px] font-bold text-[#B8894A]">{Math.round(progress)}% complete</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docTypes.map((dt) => {
          const status = getDocStatus(dt.k);
          return (
            <Card key={dt.k}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {status === "approved" ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <Clock size={20} className="text-amber-600" />
                    )}
                    <div>
                      <div className="text-[13px] font-bold text-[#0A0A0A]">{dt.l}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-0.5">
                        {status || "Not uploaded"}
                      </div>
                    </div>
                  </div>
                  {status && <Badge variant={variantMap[status] || "warning"}>{status}</Badge>}
                </div>

                {!status && (
                  <label className="mt-4 block cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(dt.k, f);
                      }}
                    />
                    <div className="w-full py-2.5 rounded-xl bg-[#0A0A0A] text-white text-[13px] font-semibold text-center hover:bg-[#262626] transition flex items-center justify-center gap-2">
                      {uploading === dt.k ? (
                        <><Loader2 className="animate-spin" size={13} /> Uploading...</>
                      ) : (
                        <><Upload size={13} /> Upload Document</>
                      )}
                    </div>
                  </label>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
EOF

# ============================================================
# 5. PRODUCT CREATE (fix existing)
# ============================================================

cat > src/app/products/new/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "", fabric: "",
    color: "", gender: "", price: "", moq: "", visibility: "verified_retailers",
  });
  const router = useRouter();

  const submit = async () => {
    if (!form.title) return setError("Title required");
    setLoading(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price) || 0,
        moq: Number(form.moq) || 0,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/products");
    else {
      const d = await res.json();
      setError(d.error || "Failed");
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">New Product</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !form.title}>
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
# 6. COMING SOON PAGE WRAPPER
# ============================================================

cat > src/components/ComingSoon.tsx << 'EOF'
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardBody className="text-center py-20">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBF6EF] border border-[#E8D9BF] mb-5">
          <Clock size={24} className="text-[#B8894A]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <h2 className="text-[1.25rem] font-extrabold text-[#0A0A0A]">{title}</h2>
          <Badge variant="gold">Coming Soon</Badge>
        </div>
        <p className="text-[14px] text-[#6B6B6B] max-w-md mx-auto">{description}</p>
        <p className="text-[12px] text-[#9B9B9B] mt-6">Ye feature next release me aa raha hai.</p>
      </CardBody>
    </Card>
  );
}
EOF

# Update AI upload + boost pages to Coming Soon
cat > src/app/products/upload/page.tsx << 'EOF'
import ComingSoon from "@/components/ComingSoon";
export default function Page() {
  return (
    <div className="max-w-2xl">
      <ComingSoon
        title="AI Quick Upload"
        description="Photo/Video daalo aur AI khud title, category, fabric, tags suggest karega. Image-based product listings in seconds."
      />
    </div>
  );
}
EOF

cat > src/app/boost/page.tsx << 'EOF'
import ComingSoon from "@/components/ComingSoon";
export default function Page() {
  return (
    <div className="max-w-2xl">
      <ComingSoon
        title="Profile Boost"
        description="Top 25/50/100 km me apni profile dikhaao. Redis-cached ranking for 3 lakh users."
      />
    </div>
  );
}
EOF

cat > src/app/search/page.tsx << 'EOF'
import ComingSoon from "@/components/ComingSoon";
export default function Page() {
  return (
    <div className="max-w-2xl">
      <ComingSoon
        title="AI Search"
        description="Natural language search: 'Mujhe Ahmedabad ke paas ₹300 me women's kurti chahiye' — AI samjhega aur filter karega."
      />
    </div>
  );
}
EOF

# ============================================================
# 7. VERCEL DEPLOY CONFIG
# ============================================================

cat > vercel.json << 'EOF'
{
  "framework": "nextjs",
  "regions": ["bom1"]
}
EOF

cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_APP_URL=
EOF

echo ""
echo "======================================================"
echo "  ✅ Mega-wire complete!"
echo "======================================================"
echo ""
echo "  NEXT STEPS (VERY IMPORTANT):"
echo ""
echo "  1. Supabase → Storage → Create bucket:"
echo "     Name: verification-docs"
echo "     Public: NO (private)"
echo ""
echo "  2. Supabase → Database → Replication → Enable realtime on:"
echo "     - messages"
echo "     - conversations"
echo ""
echo "  3. Run this SQL in Supabase SQL Editor:"
echo ""
echo "     ALTER TABLE messages REPLICA IDENTITY FULL;"
echo "     ALTER TABLE conversations REPLICA IDENTITY FULL;"
echo ""
echo "  4. Restart: npm run dev:all"
echo ""
echo "  5. Test: /products /chat /rfq /verification"
echo "======================================================"