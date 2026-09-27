import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardBody className="text-center py-20">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FBF6EF] border border-[#E8D9BF] mb-5">
          <Clock size={24} className="text-[#B8894A]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <h2 className="text-[1.25rem] font-extrabold text-[#0A0A0A]">{title}</h2>
          <Badge variant="gold">Coming Soon</Badge>
        </div>
        <p className="text-[14px] text-[#6B6B6B] max-w-md mx-auto">{description}</p>
        <p className="text-[12px] text-[#9B9B9B] mt-6">Ye feature next release me aa raha hai.</p>
      </CardBody>
    </Card>
  );
}
