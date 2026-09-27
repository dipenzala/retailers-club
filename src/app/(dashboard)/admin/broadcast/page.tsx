"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Bell, Check } from "lucide-react";
export default function AdminBroadcast() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(0);
  const send = async () => {
    if (!title) return;
    setSending(true);
    const res = await fetch("/api/admin/broadcast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body, target }) });
    const d = await res.json();
    setSending(false); setDone(d.sent || 0); setTitle(""); setBody("");
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Bell size={16} className="text-[#B8894A]" /><div className="text-[15px] font-bold">Broadcast Notification</div></div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Send notification to all users or specific role</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] min-h-[100px]" />
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
            <option value="all">All Users</option>
            <option value="manufacturers">Manufacturers Only</option>
            <option value="retailers">Retailers Only</option>
          </select>
          <Button onClick={send} disabled={!title || sending} className="w-full">{sending ? "Sending..." : "Send"}</Button>
          {done > 0 && <div className="text-[12px] text-emerald-700 bg-emerald-50 border rounded-xl px-3 py-2 flex items-center gap-2"><Check size={13} /> Sent to {done} users</div>}
        </CardBody>
      </Card>
    </div>
  );
}
