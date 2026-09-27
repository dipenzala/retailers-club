"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Check, Plus, X, Camera } from "lucide-react";

const BUSINESS_TYPES = ["Manufacturer","Wholesaler","Distributor","Exporter","Trader","Retailer"];
const EMPLOYEE_COUNTS = ["1-10","11-50","51-100","101-500","500+"];
const TURNOVERS = ["Below ₹10L","₹10L - ₹50L","₹50L - ₹1Cr","₹1Cr - ₹5Cr","₹5Cr - ₹25Cr","₹25Cr+"];
const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then((d) => {
      setProfile(d.profile || {});
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (k: string, v: any) => setProfile({ ...profile, [k]: v });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  const tabs = [
    { k: "basic", l: "Basic Info" },
    { k: "business", l: "Business" },
    { k: "address", l: "Address" },
    { k: "bank", l: "Bank" },
    { k: "social", l: "Social" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Card */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="relative">
              <Avatar name={profile.business_name || "U"} size={88} />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[1.35rem] font-extrabold">{profile.business_name || "Your Business"}</h1>
                {profile.is_verified && <Badge variant="success">✓ Verified</Badge>}
                {!profile.is_verified && <Badge variant="warning">Pending Verification</Badge>}
              </div>
              <div className="text-[13px] text-[#6B6B6B] mt-1">
                {profile.role} {profile.city && `• ${profile.city}`} {profile.state && `, ${profile.state}`}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {profile.gst_verified && <Badge variant="gold">GST ✓</Badge>}
                {profile.pan_verified && <Badge variant="gold">PAN ✓</Badge>}
                {profile.msme_verified && <Badge variant="gold">MSME ✓</Badge>}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setActiveTab(t.k)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition ${
              activeTab === t.k ? "bg-[#0A0A0A] text-white" : "bg-white border border-[#E7E5E4] text-[#6B6B6B]"
            }`}>{t.l}</button>
        ))}
      </div>

      {/* Basic Info */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">Basic Information</div></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Business Name" value={profile.business_name} onChange={(v) => set("business_name", v)} />
            <Field label="Designation" value={profile.designation} onChange={(v) => set("designation", v)} placeholder="Owner / CEO" />
            <Field label="Phone" value={profile.phone} onChange={(v) => set("phone", v)} placeholder="+91" />
            <Field label="Alternate Phone" value={profile.alternate_phone} onChange={(v) => set("alternate_phone", v)} placeholder="+91" />
            <Field label="WhatsApp" value={profile.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="+91" />
            <Field label="Email" value={profile.email} onChange={(v) => set("email", v)} placeholder="you@example.com" />
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold block mb-1.5">Business Description</label>
              <textarea value={profile.business_description || ""} onChange={(e) => set("business_description", e.target.value)}
                placeholder="Aap kya karte hain, kaunse products banate hain..."
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] min-h-[120px]" />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Business */}
      {activeTab === "business" && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">Business Details</div></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold block mb-1.5">Business Type</label>
              <select value={profile.business_type || ""} onChange={(e) => set("business_type", e.target.value)}
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
                <option value="">Select</option>
                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Established Year" value={profile.established_year} onChange={(v) => set("established_year", v)} type="number" placeholder="2005" />
            <div>
              <label className="text-[12px] font-semibold block mb-1.5">Employee Count</label>
              <select value={profile.employee_count || ""} onChange={(e) => set("employee_count", e.target.value)}
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
                <option value="">Select</option>
                {EMPLOYEE_COUNTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold block mb-1.5">Annual Turnover</label>
              <select value={profile.annual_turnover || ""} onChange={(e) => set("annual_turnover", e.target.value)}
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
                <option value="">Select</option>
                {TURNOVERS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="GST Number" value={profile.gst_number} onChange={(v) => set("gst_number", v.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
            <Field label="PAN Number" value={profile.pan_number} onChange={(v) => set("pan_number", v.toUpperCase())} placeholder="ABCDE1234F" />
            <Field label="MSME / Udyam Number" value={profile.msme_number} onChange={(v) => set("msme_number", v)} />
            <Field label="Primary Category" value={profile.primary_category} onChange={(v) => set("primary_category", v)} placeholder="Women's Wear" />
          </CardBody>
        </Card>
      )}

      {/* Address */}
      {activeTab === "address" && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">Address Details</div></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold block mb-1.5">Full Address</label>
              <textarea value={profile.address || ""} onChange={(e) => set("address", e.target.value)}
                placeholder="Shop / Building, Street, Area"
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] min-h-[80px]" />
            </div>
            <Field label="City" value={profile.city} onChange={(v) => set("city", v)} />
            <Field label="District" value={profile.district} onChange={(v) => set("district", v)} />
            <div>
              <label className="text-[12px] font-semibold block mb-1.5">State</label>
              <select value={profile.state || ""} onChange={(e) => set("state", e.target.value)}
                className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Field label="Pincode" value={profile.pincode} onChange={(v) => set("pincode", v)} placeholder="380001" />
            <Field label="Business Hours" value={profile.business_hours} onChange={(v) => set("business_hours", v)} placeholder="Mon-Sat, 10am-7pm" />
            <Field label="Country" value={profile.country} onChange={(v) => set("country", v)} />
          </CardBody>
        </Card>
      )}

      {/* Bank */}
      {activeTab === "bank" && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">Bank Details (Private)</div></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Bank Name" value={profile.bank_name} onChange={(v) => set("bank_name", v)} />
            <Field label="Account Number" value={profile.account_number} onChange={(v) => set("account_number", v)} />
            <Field label="IFSC Code" value={profile.ifsc_code} onChange={(v) => set("ifsc_code", v.toUpperCase())} />
            <div className="md:col-span-2 text-[12px] text-[#6B6B6B] bg-[#FAFAF9] rounded-xl p-3">
              🔒 Bank details sirf admin ko dikhengi — public nahi.
            </div>
          </CardBody>
        </Card>
      )}

      {/* Social */}
      {activeTab === "social" && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">Online Presence</div></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Website" value={profile.website} onChange={(v) => set("website", v)} placeholder="https://..." />
            <Field label="Instagram" value={profile.instagram} onChange={(v) => set("instagram", v)} placeholder="@username" />
            <Field label="Facebook" value={profile.facebook} onChange={(v) => set("facebook", v)} />
          </CardBody>
        </Card>
      )}

      {/* Save */}
      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button onClick={save} disabled={saving} className="shadow-lg">
          {saving ? "Saving..." : saved ? <><Check size={14} /> Saved</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="text-[12px] font-semibold block mb-1.5">{label}</label>
      <Input value={value || ""} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} type={type} />
    </div>
  );
}
