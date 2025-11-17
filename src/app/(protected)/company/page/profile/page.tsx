"use client";
import { useAuthGuard } from "@/lib/useAuthGuard";
import CompanyProfileForm from "@/app/(protected)/company/components/profile/CompanyProfileForm";

interface CompanyItemProps {
  params: Promise<{ id: string }>;
}

export default function CompanyProfile({ params }: CompanyItemProps) {
  const isAuthorized = useAuthGuard("COMPANY", "/");

  if (!isAuthorized) {
    return null;
  }
  
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <CompanyProfileForm />
    </div>
  );
}
