"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader2 } from "lucide-react";
export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/audit").then((r) => r.json()).then((d) => { setLogs(d.logs || []); setLoading(false); });
  }, []);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-[18px] font-extrabold">Audit Logs</h1>
      {logs.length === 0 ? <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No logs</CardBody></Card> : (
        <Card>
          <div className="divide-y">
            {logs.map((l) => (
              <div key={l.id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold">{l.action}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-0.5">{l.target_type} • {new Date(l.created_at).toLocaleString()}</div>
                </div>
                <Badge>{l.target_type || "system"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
