"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/store/auth";

export function useProfile() {
  const { profile, setProfile } = useAuth();
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setProfile(null);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data as any);
    })();
  }, [setProfile]);
  return profile;
}
