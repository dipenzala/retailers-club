"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HelpCircle, Plus, ChevronDown, Loader2 } from "lucide-react";

export default function SupportPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category: "verification" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await fetch("/api/support");
    const d = await res.json();
    setFaqs(d.faqs || []); setTickets(d.tickets || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.subject) return;
    setSubmitting(true);
    await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSubmitting(false); setShowForm(false); setForm({ subject: "", description: "", category: "verification" }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <HelpCircle size={32} className="mx-auto text-[#B8894A]" />
        <h1 className="text-[1.5rem] font-extrabold mt-3">Help & Support</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-1">Verification aur kisi bhi issue me help lein</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-bold">Support Tickets ({tickets.length})</div>
            <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus size={13} /> New Ticket</Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardBody className="space-y-3 border-b">
            <Input placeholder="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea placeholder="Describe your issue..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 outline-none text-[14px] min-h-[100px]" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
              <option value="verification">Verification Issue</option>
              <option value="products">Products / Upload</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
            <Button onClick={submit} disabled={submitting || !form.subject} className="w-full">
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </CardBody>
        )}
        {tickets.length > 0 && (
          <div className="divide-y">
            {tickets.map((t) => (
              <div key={t.id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold">{t.subject}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-0.5">{t.category}</div>
                </div>
                <Badge variant={t.status === "open" ? "warning" : "success"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <CardHeader><div className="text-[15px] font-bold">FAQ</div></CardHeader>
        <div className="divide-y">
          {faqs.map((f) => (
            <div key={f.id}>
              <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FAFAF9]">
                <div className="text-[13px] font-bold pr-4">{f.question}</div>
                <ChevronDown size={16} className={`transition shrink-0 ${openFaq === f.id ? "rotate-180" : ""}`} />
              </button>
              {openFaq === f.id && <div className="px-5 pb-4 text-[13px] text-[#6B6B6B]">{f.answer}</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
