"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  moq: number;
  visibility: string;
  media_urls: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">
            <Filter size={15} /> Filters
          </Button>
          <div className="flex gap-2">
            <Badge>All</Badge>
            <Badge>Active</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/products/upload">
            <Button variant="secondary" size="md">
              <Upload size={15} /> AI Upload
            </Button>
          </Link>
          <Link href="/products/new">
            <Button size="md">
              <Plus size={15} /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#6B6B6B]" size={24} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-[15px] font-bold text-[#0A0A0A]">No products yet</div>
          <div className="text-[13px] text-[#6B6B6B] mt-1">
            Create your first product to get started
          </div>
          <Link href="/products/new">
            <Button className="mt-4">
              <Plus size={15} /> Create Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition cursor-pointer">
                <div className="aspect-[4/5] bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative">
                  {p.media_urls?.[0] && (
                    <img
                      src={p.media_urls[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge variant="success" className="absolute top-3 left-3">
                    {p.visibility}
                  </Badge>
                </div>
                <CardBody className="!p-4">
                  <div className="text-[11px] text-[#6B6B6B] font-semibold">
                    {p.category || "General"}
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-[#0A0A0A] line-clamp-1">
                    {p.title}
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[15px] font-extrabold text-[#0A0A0A]">
                        ₹{p.price || 0}
                      </div>
                      <div className="text-[11px] text-[#6B6B6B]">MOQ {p.moq || 0}</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
