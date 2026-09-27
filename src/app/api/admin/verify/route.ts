import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!me || !["admin", "super_admin", "verification_admin"].includes(me.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data } = await supabase
    .from("verification_docs")
    .select("*, profiles!verification_docs_user_id_fkey(business_name, city, phone)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return NextResponse.json({ docs: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { doc_id, action, notes } = await req.json();
  if (!["approved", "rejected", "correction_requested"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: doc } = await supabase.from("verification_docs").update({
    status: action, admin_notes: notes, reviewed_by: user.id,
  }).eq("id", doc_id).select().single();

  // Notify user
  if (doc) {
    await supabase.from("notifications").insert({
      user_id: doc.user_id, kind: "verification",
      title: `Document ${action}`,
      body: `Your ${doc.doc_type} document has been ${action}`,
      link: "/verification",
    });
  }

  return NextResponse.json({ ok: true, doc });
}
