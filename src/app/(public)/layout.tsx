import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      <main className="pt-20">{children}</main>
      <PublicFooter />
    </div>
  );
}
