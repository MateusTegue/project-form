"use client";
import { useEffect, useState } from "react";
import { FileText} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGetSubmissionStats } from "../../hook/getSubmissionStats/useGetSubmissionStats";
import { authService } from "@/lib/auth";

export default function SagridocCard() {
  const [companyId, setCompanyId] = useState<string>("");
  const { stats, loading } = useGetSubmissionStats(companyId);

  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      if (user?.id) {
        setCompanyId(user.id);
      }
    } catch (error) {
    }
  }, []);

  const pendingCount = loading ? 0 : stats.pendiente;

  return (
    <Card className="w-[400px] h-[180px] border rounded-xl mt-6  border-gray-200 shadow-md bg-white">
      <CardContent className="pr-6 pl-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Sagridoc</span>
          <FileText size={16} className="text-gray-600" />
        </div>
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{pendingCount}</h1>
          <p className="text-xs text-gray-600">
            Registros pendientes por procesar
          </p>
        </div>
        <div className="mt-8">
          <Link href="/company/page/sagridocs" className="text-center">
            <p>Ir a Sagridoc</p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
