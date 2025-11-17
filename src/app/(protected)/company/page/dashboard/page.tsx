"use client";
import SagridocCard from "../../components/sagridocs/SagridocsCard"
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function AdminDashboard() {
  const isAuthorized = useAuthGuard("COMPANY", "/");

  if (!isAuthorized) {
    return null;
  }
  
  return (
    <div className="flex w-full h-full">
      <main className="w-full m-6">
        <h1 className="text-2xl font-bold">Inicio</h1>
        <SagridocCard />
      </main>
    </div>
  );
}
