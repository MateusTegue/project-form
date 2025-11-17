"use client";
import { useAuthGuard } from "@/lib/useAuthGuard";
import CompanyShowCard from "../../components/company/CompanyShowCard";
import ModulesShowCard from "../../components/modules/ModulesShowCard";
import FormTemplateList from "../../components/templates/GetAllFormTemplate";
import FormCard from "../../components/templates/TemplateCreatedCard";

export default function DashboardSuperAdmin() {
  const isAuthorized = useAuthGuard("SUPER_ADMIN", "/");

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="w-full">
      <main className=" m-6 ">
        <h1 className="text-2xl font-bold">Inicio</h1>
        <div className="flex flex-wrap gap-4 mt-2">
          <CompanyShowCard />
          <ModulesShowCard />
          <FormCard />
        </div>
      </main>
    </div>
  );
}
