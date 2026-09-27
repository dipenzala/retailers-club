"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, Check, X, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function VerificationQueue() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/verify");
    const data = await res.json();
    setDocs(data.docs || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const signUrl = async (path: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from("verification-docs").createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const act = async (id: string, action: string) => {
    setBusy(id);
    await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc_id: id, action }),
    });
    setBusy(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-[18px] font-extrabold">Verification Queue ({docs.length})</h1>
      {docs.length === 0 ? (
        <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No pending verifications 🎉</CardBody></Card>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <div className="text-[14px] font-bold">{d.doc_type.toUpperCase()}</div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <div className="text-[12px] text-[#6B6B6B] mt-1">
                      {d.profiles?.business_name} • {d.profiles?.city} • {d.profiles?.phone}
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => signUrl(d.file_url)}>View</Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1" onClick={() => act(d.id, "approved")} disabled={busy === d.id}>
                    <Check size={13} /> Approve
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => act(d.id, "correction_requested")} disabled={busy === d.id}>
                    Request Correction
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => act(d.id, "rejected")} disabled={busy === d.id}>
                    <X size={13} /> Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
