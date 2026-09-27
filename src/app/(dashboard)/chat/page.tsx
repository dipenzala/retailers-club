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
