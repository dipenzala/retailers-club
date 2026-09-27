import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, body, target } = await req.json();
  let q = supabase.from("profiles").select("id");
  if (target === "manufacturers") q = q.eq("role", "manufacturer");
  if (target === "retailers") q = q.eq("role", "retailer");
  const { data: users } = await q;
  if (users && users.length > 0) {
    await supabase.from("notifications").insert(users.map((u) => ({
      user_id: u.id, kind: "broadcast", title, body: body || "", link: "/notifications",
    })));
  }
  return NextResponse.json({ ok: true, sent: users?.length || 0 });
}
