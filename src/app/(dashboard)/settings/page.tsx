"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data || { business_name: "", city: "", phone: "" });
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setSaving(false);
    await supabase.from("profiles").update({
      business_name: profile.business_name,
      city: profile.city,
    }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <div className="text-center py-20 text-[#6B6B6B]">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">Profile</div>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={profile.business_name || "U"} size={64} />
            <div>
              <div className="text-[14px] font-bold text-[#0A0A0A]">{profile.business_name || "Your Business"}</div>
              <div className="text-[12px] text-[#6B6B6B]">{profile.city || "City not set"}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">Business Name</label>
              <Input
                value={profile.business_name || ""}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">City</label>
              <Input
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end items-center gap-3">
            {saved && <span className="text-[12px] font-semibold text-emerald-600">✓ Saved</span>}
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
