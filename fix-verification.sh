#!/bin/bash
set -e

echo "🔧 Fixing verification route + pages..."

# 1. Delete any outside-dashboard folders that conflict
echo "🗑  Removing conflicting outside folders..."
rm -rf src/app/verification
rm -rf src/app/settings
rm -rf src/app/products
rm -rf src/app/chat
rm -rf src/app/rfq
rm -rf src/app/search
rm -rf src/app/boost

# 2. Ensure (dashboard) folders exist
DASH="src/app/(dashboard)"
mkdir -p "$DASH/verification"
mkdir -p "$DASH/settings"
mkdir -p "$DASH/products/new"
mkdir -p "$DASH/products/upload"
mkdir -p "$DASH/chat"
mkdir -p "$DASH/rfq/new"
mkdir -p "$DASH/search"
mkdir -p "$DASH/boost"

# 3. Real Verification Page
cat > "$DASH/verification/page.tsx" << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Upload, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const docTypes = [
  { k: "gst", l: "GST Certificate" },
  { k: "msme", l: "MSME / Udyam" },
  { k: "pan", l: "PAN Card" },
  { k: "address", l: "Business Address Proof" },
];

const variantMap: Record<string, "success" | "warning" | "danger"> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

export default function VerificationPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const loadDocs = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);
    const { data } = await supabase.from("verification_docs").select("*").eq("user_id", user.id);
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { loadDocs(); }, []);

  const upload = async (docType: string, file: File) => {
    setUploading(docType);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setUploading(null);

    const path = `${user.id}/${docType}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("verification-docs")
      .upload(path, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(null);
      return;
    }

    await supabase.from("verification_docs").insert({
      user_id: user.id,
      doc_type: docType,
      file_url: path,
      status: "pending",
    });

    setUploading(null);
    loadDocs();
  };

  const getDocStatus = (docType: string) => {
    const doc = docs.find((d) => d.doc_type === docType);
    return doc ? doc.status : null;
  };

  const approved = docs.filter((d) => d.status === "approved").length;
  const progress = (approved / docTypes.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#6B6B6B]" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FBF6EF] border border-[#E8D9BF] flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#B8894A]" />
            </div>
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-[#0A0A0A]">Verification Status</div>
              <div className="text-[13px] text-[#6B6B6B] mt-1">
                {approved} of {docTypes.length} documents verified
              </div>
              <div className="mt-4 w-full h-2 bg-[#FAFAF9] rounded-full overflow-hidden">
                <div className="h-full bg-[#B8894A] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 text-[12px] font-bold text-[#B8894A]">{Math.round(progress)}% complete</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docTypes.map((dt) => {
          const status = getDocStatus(dt.k);
          return (
            <Card key={dt.k}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {status === "approved" ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <Clock size={20} className="text-amber-600" />
                    )}
                    <div>
                      <div className="text-[13px] font-bold text-[#0A0A0A]">{dt.l}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-0.5">
                        {status || "Not uploaded"}
                      </div>
                    </div>
                  </div>
                  {status && <Badge variant={variantMap[status] || "warning"}>{status}</Badge>}
                </div>

                {!status && (
                  <label className="mt-4 block cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(dt.k, f);
                      }}
                    />
                    <div className="w-full py-2.5 rounded-xl bg-[#0A0A0A] text-white text-[13px] font-semibold text-center hover:bg-[#262626] transition flex items-center justify-center gap-2">
                      {uploading === dt.k ? (
                        <><Loader2 className="animate-spin" size={13} /> Uploading...</>
                      ) : (
                        <><Upload size={13} /> Upload Document</>
                      )}
                    </div>
                  </label>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
EOF

# 4. Real Settings Page
cat > "$DASH/settings/page.tsx" << 'EOF'
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
EOF

echo ""
echo "✅ Fix complete!"
echo ""
echo "📁 Verification files:"
ls -1 "$DASH/verification/"
echo ""
echo "Now run:"
echo "  rm -rf .next"
echo "  npm run dev:all"
echo ""
echo "Then test: http://localhost:3000/verification"
echo ""