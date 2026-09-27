"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const res = await fetch("/api/admin/reports");
    const d = await res.json(); setReports(d.reports || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const update = async (id: string, status: string) => {
    await fetch("/api/admin/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report_id: id, status }) });
    load();
  };
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="space-y-5">
      <div className="text-[15px] font-bold">Reports ({reports.length})</div>
      {reports.length === 0 ? <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No reports 🎉</CardBody></Card> : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}><CardBody>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13px] font-bold">Reason: {r.reason}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-1">{r.details || "No details"}</div>
                </div>
                <Badge variant={r.status === "pending" ? "warning" : "success"}>{r.status}</Badge>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => update(r.id, "resolved")}>Resolve</Button>
                  <Button size="sm" variant="secondary" onClick={() => update(r.id, "dismissed")}>Dismiss</Button>
                </div>
              )}
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
