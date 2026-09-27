import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
  return NextResponse.json({ categories: data || [] });
}
