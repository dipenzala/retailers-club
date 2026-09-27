"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export default function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const load = async () => {
    const sb = createClient();
    const { data } = await sb.from("support_tickets").select("*").order("created_at", { ascending: false });
    setTickets(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const sendReply = async (t: any) => {
    const sb = createClient();
    await sb.from("support_tickets").update({ admin_reply: reply, status: "resolved" }).eq("id", t.id);
    await sb.from("notifications").insert({
      user_id: t.user_id, kind: "support_reply",
      title: "Support replied to your ticket", body: reply.slice(0, 80), link: "/support",
    });
    setReplyingTo(null); setReply(""); load();
  };
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="space-y-5">
      <div className="text-[15px] font-bold">Support Tickets ({tickets.length})</div>
      {tickets.length === 0 ? <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No tickets 🎉</CardBody></Card> : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id}><CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold">{t.subject}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-1">{t.description || "No description"}</div>
                </div>
                <Badge variant={t.status === "open" ? "warning" : "success"}>{t.status}</Badge>
              </div>
              {t.admin_reply && <div className="mt-3 p-3 bg-emerald-50 border rounded-xl text-[12px]"><b>Reply:</b> {t.admin_reply}</div>}
              {t.status === "open" && (
                replyingTo === t.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply..."
                      className="w-full bg-[#FAFAF9] border rounded-xl px-3 py-2 text-[13px] min-h-[80px]" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => sendReply(t)}>Send</Button>
                      <Button size="sm" variant="secondary" onClick={() => setReplyingTo(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : <Button size="sm" className="mt-3" onClick={() => setReplyingTo(t.id)}>Reply</Button>
              )}
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
