"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Send, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";

function timeAgo(date: string | null) {
  if (!date) return "offline";
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function ChatInner() {
  const params = useSearchParams();
  const convId = params.get("c");
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(convId);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherName, setOtherName] = useState("User");
  const [otherLastSeen, setOtherLastSeen] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      fetch("/api/ping", { method: "POST" });
      setInterval(() => fetch("/api/ping", { method: "POST" }), 30000);
      const { data: convs } = await sb.from("conversations").select("*").contains("participants", [user.id]).order("last_at", { ascending: false });
      setConversations(convs || []);
      if (!activeId && convs && convs.length > 0) setActiveId(convs[0].id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!activeId || !userId) return;
    const sb = createClient();
    sb.from("messages").select("*").eq("conversation_id", activeId).order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));
    const conv = conversations.find((c) => c.id === activeId);
    if (conv) {
      const other = conv.participants.find((p: string) => p !== userId);
      if (other) {
        sb.from("profiles").select("business_name, last_seen_at").eq("id", other).single()
          .then(({ data }) => { setOtherName(data?.business_name || "User"); setOtherLastSeen(data?.last_seen_at); });
      }
    }
    const ch = sb.channel(`chat:${activeId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
        (payload: any) => setMessages((prev) => [...prev, payload.new]))
      .subscribe();
    return () => sb.removeChannel(ch);
  }, [activeId, userId, conversations]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (content: string, kind = "text", meta: any = {}) => {
    if (!userId || !activeId) return;
    const sb = createClient();
    await sb.from("messages").insert({ conversation_id: activeId, sender_id: userId, content, kind, attachment_url: meta.attachment_url });
    await sb.from("conversations").update({ last_message: content, last_at: new Date().toISOString() }).eq("id", activeId);
  };
  const handleSend = async () => { if (!input.trim()) return; const c = input; setInput(""); await send(c); };
  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (d.url) await send("📷", "image", { attachment_url: d.url });
    setUploading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-160px)]"><Loader2 className="animate-spin" /></div>;
  if (conversations.length === 0) return (
    <div className="bg-white border rounded-2xl p-20 text-center">
      <div className="text-[15px] font-bold">No conversations yet</div>
      <div className="text-[13px] text-[#6B6B6B] mt-1">Product page se Inquire click karo</div>
    </div>
  );

  const isOnline = otherLastSeen && (Date.now() - new Date(otherLastSeen).getTime()) < 120000;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden h-[calc(100vh-160px)] flex">
      <div className="w-[280px] border-r hidden md:flex flex-col">
        <div className="px-4 py-4 border-b">
          <div className="text-[14px] font-bold">Messages</div>
          <div className="text-[11px] text-[#6B6B6B]">{conversations.length} conversations</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div key={c.id} onClick={() => setActiveId(c.id)}
              className={`px-4 py-3 border-b cursor-pointer hover:bg-[#FAFAF9] ${activeId === c.id ? "bg-[#FAFAF9]" : ""}`}>
              <div className="text-[12px] text-[#6B6B6B] truncate">{c.last_message || "No messages"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={otherName} size={36} />
            <div>
              <div className="text-[14px] font-bold">{otherName}</div>
              {isOnline ? <div className="text-[11px] text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online</div>
              : <div className="text-[11px] text-[#6B6B6B]">Last seen {timeAgo(otherLastSeen)}</div>}
            </div>
          </div>
          <Badge variant="gold">Verified</Badge>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF9]">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] ${m.sender_id === userId ? "bg-[#0A0A0A] text-white rounded-br-md" : "bg-white border rounded-bl-md"}`}>
                {m.attachment_url ? <img src={m.attachment_url} className="rounded-lg max-w-full" /> : m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t flex items-center gap-2">
          <label className="w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer shrink-0">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            {uploading ? <Loader2 className="animate-spin" size={15} /> : <ImageIcon size={16} />}
          </label>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message likho..." className="flex-1 bg-[#FAFAF9] border rounded-xl px-4 py-2.5 outline-none text-[13px]" />
          <button onClick={handleSend} className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}><ChatInner /></Suspense>;
}
