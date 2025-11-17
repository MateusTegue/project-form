
"use client";
import { useAuthGuard } from "@/lib/useAuthGuard";
import CreateModulesForTemplates from "../../components/modules/create/CreateModulesForTemplates";
import GetAllModulesCreated from "../../components/modules/GetAllModulesCreated";

export default function ModulesPage() {
  const isAuthorized = useAuthGuard("SUPER_ADMIN", "/");

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <main className="container mx-auto flex gap-6 p-6 space-y-6">
        <CreateModulesForTemplates />
        <GetAllModulesCreated />
      </main>
    </div>
  );
}
