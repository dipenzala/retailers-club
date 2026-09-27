"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Send, Loader2, Image as ImageIcon, Package, MoreVertical, Check, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";

type Message = any;

function ChatInner() {
  const params = useSearchParams();
  const convId = params.get("c");
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(convId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [otherName, setOtherName] = useState("User");
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Load user + conversations
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: convs } = await supabase
        .from("conversations").select("*").contains("participants", [user.id])
        .order("last_at", { ascending: false });
      setConversations(convs || []);
      if (!activeId && convs && convs.length > 0) setActiveId(convs[0].id);
      setLoading(false);
    })();
  }, []);

  // Load messages + realtime
  useEffect(() => {
    if (!activeId || !userId) return;
    const supabase = createClient();

    supabase.from("messages").select("*").eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Fetch other user name
    const activeConv = conversations.find((c) => c.id === activeId);
    if (activeConv) {
      const other = activeConv.participants.find((p: string) => p !== userId);
      if (other) {
        supabase.from("profiles").select("business_name").eq("id", other).single()
          .then(({ data }) => setOtherName(data?.business_name || "User"));
      }
    }

    // Clean old channel
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const ch = supabase.channel(`chat:${activeId}`, { config: { broadcast: { self: true } } });
    ch.on("postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
      (payload) => setMessages((prev) => [...prev, payload.new])
    );
    ch.on("broadcast", { event: "typing" }, () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2500);
    });
    ch.subscribe();
    channelRef.current = ch;

    return () => { supabase.removeChannel(ch); };
  }, [activeId, userId, conversations]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (content: string, kind = "text", meta: any = {}) => {
    if (!userId || !activeId) return;
    const supabase = createClient();
    await supabase.from("messages").insert({
      conversation_id: activeId, sender_id: userId, content, kind,
      attachment_url: meta.attachment_url, attachment_type: meta.attachment_type,
      product_id: meta.product_id,
    });
    await supabase.from("conversations").update({
      last_message: kind === "text" ? content : `[${kind}]`, last_at: new Date().toISOString(),
    }).eq("id", activeId);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const content = input;
    setInput("");
    await send(content);
  };

  const onTyping = () => {
    channelRef.current?.send({ type: "broadcast", event: "typing", payload: {} });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) await send("📷 Image", "image", { attachment_url: data.url, attachment_type: "image" });
    setUploading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-160px)]"><Loader2 className="animate-spin" size={24} /></div>;

  if (conversations.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-2xl p-20 text-center">
        <div className="text-[15px] font-bold">No conversations yet</div>
        <div className="text-[13px] text-[#6B6B6B] mt-1">Start a chat from any product page</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden h-[calc(100vh-160px)] flex">
      <div className="w-[300px] lg:w-[320px] border-r border-[#E7E5E4] flex-col hidden md:flex">
        <div className="px-4 py-4 border-b border-[#E7E5E4]">
          <div className="text-[14px] font-bold">Messages</div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">{conversations.length} conversations</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div key={c.id} onClick={() => setActiveId(c.id)}
              className={`px-4 py-3 border-b border-[#E7E5E4] cursor-pointer hover:bg-[#FAFAF9] transition ${activeId === c.id ? "bg-[#FAFAF9]" : ""}`}>
              <div className="flex items-center gap-3">
                <Avatar name={c.participants.join("")} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold truncate">Conversation</div>
                  <div className="text-[12px] text-[#6B6B6B] truncate">{c.last_message || "No messages"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 lg:py-4 border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={otherName} size={36} />
            <div>
              <div className="text-[14px] font-bold">{otherName}</div>
              {typing ? (
                <div className="text-[11px] text-[#B8894A] font-medium">typing...</div>
              ) : (
                <div className="text-[11px] text-emerald-600 font-medium">Online</div>
              )}
            </div>
          </div>
          <Badge variant="gold">Verified</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 bg-[#FAFAF9]">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] ${
                m.sender_id === userId ? "bg-[#0A0A0A] text-white rounded-br-md" : "bg-white border border-[#E7E5E4] rounded-bl-md"
              }`}>
                {m.kind === "image" && m.attachment_url ? (
                  <img src={m.attachment_url} className="rounded-lg max-w-full" />
                ) : m.kind === "product" ? (
                  <div className="flex items-center gap-2">
                    <Package size={14} /> Product shared
                  </div>
                ) : (
                  m.content
                )}
                {m.sender_id === userId && (
                  <div className="mt-1 text-[10px] opacity-60 text-right">
                    {m.read_at ? <CheckCheck size={10} className="inline" /> : <Check size={10} className="inline" />}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 lg:p-4 border-t border-[#E7E5E4] flex items-center gap-2">
          <label className="w-10 h-10 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9] cursor-pointer shrink-0">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
            {uploading ? <Loader2 className="animate-spin" size={15} /> : <ImageIcon size={16} />}
          </label>
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); onTyping(); }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message likho..."
            className="flex-1 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-2.5 outline-none text-[13px]"
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center hover:bg-[#262626] shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
      <ChatInner />
    </Suspense>
  );
}
