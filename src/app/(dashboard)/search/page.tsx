"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Loader2, Sparkles, X, SlidersHorizontal, Bookmark } from "lucide-react";

const GENDERS = ["Men","Women","Kids","Unisex"];
const FABRICS = ["Cotton","Silk","Rayon","Georgette","Chiffon","Denim","Linen","Polyester","Wool","Khadi","Velvet","Net"];
const COLORS = ["Red","Blue","Green","Yellow","Pink","Black","White","Navy","Maroon","Beige","Orange","Purple","Grey","Multicolor"];
const OCCASIONS = ["Casual","Formal","Party","Wedding","Festive","Sports","Daily Wear","Bridal"];
const SIZES = ["XS","S","M","L","XL","XXL","3XL","Free Size"];
const PATTERNS = ["Solid","Printed","Embroidered","Striped","Checked","Floral","Geometric","Bandhani"];
const SLEEVES = ["Sleeveless","Short Sleeve","3/4 Sleeve","Full Sleeve"];
const NECK = ["Round Neck","V Neck","Collar","Boat Neck","Halter"];
const FIT = ["Slim","Regular","Loose","Oversized","Bodycon"];
const SEASONS = ["Summer","Winter","Monsoon","All Season"];
const SORTS = ["Relevance","Newest","Price: Low to High","Price: High to Low","Popular"];
const STATES = ["Gujarat","Maharashtra","Rajasthan","Tamil Nadu","Delhi","Karnataka","Uttar Pradesh","West Bengal","Punjab","Haryana","Madhya Pradesh","Kerala","Andhra Pradesh","Telangana"];

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<any>({
    gender: [], fabric: [], color: [], occasion: [], size: [], pattern: [], sleeve: [], neck: [], fit: [], season: [],
    priceMin: "", priceMax: "", moqMax: "", state: "", city: "", verifiedOnly: false, readyStock: false, customizable: false, sampleAvailable: false,
  });
  const [sort, setSort] = useState("Relevance");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  const toggleArr = (k: string, v: string) => {
    setFilters((f: any) => {
      const arr = f[k] || [];
      return { ...f, [k]: arr.includes(v) ? arr.filter((x: string) => x !== v) : [...arr, v] };
    });
  };

  const search = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length > 0) params.set(k, v.join(","));
      else if (v !== "" && v !== false && v !== null) params.set(k, String(v));
    });
    params.set("sort", sort);
    const res = await fetch(`/api/search?${params}`);
    const d = await res.json();
    setResults(d.results || []);
    setLoading(false);
  };

  const saveSearch = async () => {
    await fetch("/api/saved-searches", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q || "All", filters }),
    });
    loadSaved();
  };

  const loadSaved = async () => {
    const r = await fetch("/api/saved-searches");
    const d = await r.json();
    setSavedSearches(d.searches || []);
  };

  useEffect(() => { search(); loadSaved(); }, []);

  const activeCount = Object.values(filters).filter((v: any) => Array.isArray(v) ? v.length > 0 : (v !== "" && v !== false)).length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Search bar */}
      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2 bg-[#FAFAF9] border rounded-xl px-3 py-2.5">
            <Search size={16} className="text-[#6B6B6B]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search: kurti, saree, jeans, shirt..." className="bg-transparent flex-1 outline-none text-[14px]" />
            <Button size="sm" onClick={search} disabled={loading}>{loading ? <Loader2 className="animate-spin" size={14} /> : "Search"}</Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={showFilters ? "primary" : "secondary"} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={13} /> Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
            <Button size="sm" variant="secondary" onClick={saveSearch}><Bookmark size={13} /> Save</Button>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="bg-[#FAFAF9] border rounded-xl px-3 py-1.5 text-[13px] font-semibold">
              {SORTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {savedSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {savedSearches.slice(0, 6).map((s) => (
                <button key={s.id} onClick={() => { setQ(s.query === "All" ? "" : s.query); setFilters({ ...filters, ...(s.filters || {}) }); setTimeout(search, 100); }}
                  className="text-[11px] bg-[#FBF6EF] text-[#B8894A] border border-[#E8D9BF] px-2.5 py-1 rounded-full font-semibold">
                  {s.query}
                </button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
            <Card>
              <CardHeader><div className="text-[14px] font-bold">Price Range</div></CardHeader>
              <CardBody className="!p-4 grid grid-cols-2 gap-2">
                <Input placeholder="Min ₹" type="number" value={filters.priceMin} onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })} className="!py-2 !text-[13px]" />
                <Input placeholder="Max ₹" type="number" value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })} className="!py-2 !text-[13px]" />
              </CardBody>
            </Card>

            <FilterGroup title="Gender" options={GENDERS} selected={filters.gender} onToggle={(v) => toggleArr("gender", v)} />
            <FilterGroup title="Fabric" options={FABRICS} selected={filters.fabric} onToggle={(v) => toggleArr("fabric", v)} />
            <FilterGroup title="Color" options={COLORS} selected={filters.color} onToggle={(v) => toggleArr("color", v)} />
            <FilterGroup title="Occasion" options={OCCASIONS} selected={filters.occasion} onToggle={(v) => toggleArr("occasion", v)} />
            <FilterGroup title="Size" options={SIZES} selected={filters.size} onToggle={(v) => toggleArr("size", v)} />
            <FilterGroup title="Pattern" options={PATTERNS} selected={filters.pattern} onToggle={(v) => toggleArr("pattern", v)} />
            <FilterGroup title="Sleeve" options={SLEEVES} selected={filters.sleeve} onToggle={(v) => toggleArr("sleeve", v)} />
            <FilterGroup title="Neck" options={NECK} selected={filters.neck} onToggle={(v) => toggleArr("neck", v)} />
            <FilterGroup title="Fit" options={FIT} selected={filters.fit} onToggle={(v) => toggleArr("fit", v)} />
            <FilterGroup title="Season" options={SEASONS} selected={filters.season} onToggle={(v) => toggleArr("season", v)} />

            <Card>
              <CardHeader><div className="text-[14px] font-bold">Location</div></CardHeader>
              <CardBody className="!p-4 space-y-2">
                <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full bg-[#FAFAF9] border rounded-xl px-3 py-2 text-[13px]">
                  <option value="">All States</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <Input placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="!py-2 !text-[13px]" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><div className="text-[14px] font-bold">Seller Type</div></CardHeader>
              <CardBody className="!p-4 space-y-2.5">
                {[
                  { k: "verifiedOnly", l: "Verified Sellers Only" },
                  { k: "readyStock", l: "Ready Stock Available" },
                  { k: "customizable", l: "Customizable Products" },
                  { k: "sampleAvailable", l: "Sample Available" },
                ].map((f) => (
                  <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters[f.k]} onChange={(e) => setFilters({ ...filters, [f.k]: e.target.checked })} className="w-4 h-4" />
                    <span className="text-[13px]">{f.l}</span>
                  </label>
                ))}
              </CardBody>
            </Card>

            <Button variant="secondary" className="w-full" onClick={() => {
              setFilters({ gender: [], fabric: [], color: [], occasion: [], size: [], pattern: [], sleeve: [], neck: [], fit: [], season: [], priceMin: "", priceMax: "", moqMax: "", state: "", city: "", verifiedOnly: false, readyStock: false, customizable: false, sampleAvailable: false });
            }}>Clear All</Button>
          </div>
        )}

        {/* Results */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="text-[13px] text-[#6B6B6B] mb-3">
            <span className="font-bold text-[#0A0A0A]">{results.length}</span> results found
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>
          ) : results.length === 0 ? (
            <Card><CardBody className="text-center py-20 text-[13px] text-[#6B6B6B]">No results. Try different filters.</CardBody></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {results.map((p) => (
                <Link key={p.id} href={`/p/${p.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition cursor-pointer h-full">
                    <div className="aspect-square bg-[#FAFAF9] relative">
                      {p.media_urls?.[0] && <img src={p.media_urls[0]} className="w-full h-full object-cover" />}
                      {p.ready_stock && <Badge variant="success" className="absolute top-2 left-2 text-[9px]">Ready Stock</Badge>}
                    </div>
                    <CardBody className="!p-3">
                      <div className="text-[12px] font-bold line-clamp-2">{p.title}</div>
                      <div className="mt-1 text-[13px] font-extrabold">₹{p.price}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-0.5">MOQ {p.moq}</div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options, selected = [], onToggle }: any) {
  return (
    <Card>
      <CardHeader><div className="text-[14px] font-bold">{title}</div></CardHeader>
      <CardBody className="!p-4">
        <div className="flex flex-wrap gap-1.5">
          {options.map((o: string) => (
            <button key={o} onClick={() => onToggle(o)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                selected.includes(o) ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white border-[#E7E5E4] text-[#6B6B6B]"
              }`}>{o}</button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
