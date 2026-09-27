"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const checks = [
  { name: "Auth (session)", run: async (sb: any) => { const { data: { user } } = await sb.auth.getUser(); return user ? `Logged in as ${user.email}` : "Not logged in"; } },
  { name: "profiles table", run: async (sb: any) => { const { count } = await sb.from("profiles").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "products table", run: async (sb: any) => { const { count } = await sb.from("products").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "messages table", run: async (sb: any) => { const { count } = await sb.from("messages").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "conversations table", run: async (sb: any) => { const { count } = await sb.from("conversations").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "follows table", run: async (sb: any) => { const { count } = await sb.from("follows").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "likes table", run: async (sb: any) => { const { count } = await sb.from("likes").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "saves table", run: async (sb: any) => { const { count } = await sb.from("saves").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "verification_docs table", run: async (sb: any) => { const { count } = await sb.from("verification_docs").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "rfqs table", run: async (sb: any) => { const { count } = await sb.from("rfqs").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "notifications table", run: async (sb: any) => { const { count } = await sb.from("notifications").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "boosts table", run: async (sb: any) => { const { count } = await sb.from("boosts").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "blocks table", run: async (sb: any) => { const { count } = await sb.from("blocks").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "reports table", run: async (sb: any) => { const { count } = await sb.from("reports").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "saved_searches table", run: async (sb: any) => { const { count } = await sb.from("saved_searches").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "audit_logs table", run: async (sb: any) => { const { count } = await sb.from("audit_logs").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "contact_reveals table", run: async (sb: any) => { const { count } = await sb.from("contact_reveals").select("*", { count: "exact", head: true }); return `${count} rows`; } },
  { name: "Storage: verification-docs", run: async (sb: any) => { const { error } = await sb.storage.from("verification-docs").list("", { limit: 1 }); return error ? `Error: ${error.message}` : "Bucket OK"; } },
  { name: "Storage: product-images", run: async (sb: any) => { const { error } = await sb.storage.from("product-images").list("", { limit: 1 }); return error ? `Error: ${error.message}` : "Bucket OK"; } },
  { name: "API: /api/products", run: async () => { const r = await fetch("/api/products"); return r.ok ? "200 OK" : `${r.status}`; } },
  { name: "API: /api/search", run: async () => { const r = await fetch("/api/search"); return r.ok ? "200 OK" : `${r.status}`; } },
  { name: "API: /api/notifications", run: async () => { const r = await fetch("/api/notifications"); return r.ok ? "200 OK" : `${r.status}`; } },
  { name: "API: /api/follow", run: async () => { const r = await fetch("/api/follow?user=me"); return r.ok ? "200 OK" : `${r.status}`; } },
  { name: "API: /api/saved-searches", run: async () => { const r = await fetch("/api/saved-searches"); return r.ok ? "200 OK" : `${r.status}`; } },
  { name: "API: /api/audit", run: async () => { const r = await fetch("/api/audit"); return r.ok ? "200 OK" : `${r.status}`; } },
];

export default function DiagnosticPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const out: any[] = [];
      for (const c of checks) {
        try {
          const result = await c.run(sb);
          out.push({ name: c.name, status: "ok", message: result });
        } catch (e: any) {
          out.push({ name: c.name, status: "fail", message: e.message || String(e) });
        }
        setResults([...out]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  const pass = results.filter((r) => r.status === "ok").length;
  const fail = results.filter((r) => r.status === "fail").length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-[18px] font-extrabold">System Diagnostic</h1>
      <div className="flex gap-2">
        <Badge variant="success">{pass} passed</Badge>
        <Badge variant="danger">{fail} failed</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold">Checks ({results.length})</div>
        </CardHeader>
        <CardBody className="!p-0">
          <div className="divide-y divide-[#E7E5E4]">
            {results.map((r, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {r.status === "ok" ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-red-600" />}
                  <div className="text-[13px] font-bold">{r.name}</div>
                </div>
                <Badge variant={r.status === "ok" ? "success" : "danger"}>{r.message}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
