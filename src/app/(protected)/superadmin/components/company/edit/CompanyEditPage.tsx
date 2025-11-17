"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCompany } from "../../../hook/company/useEditCompany";
import { useDeleteCompany } from "@/app/(protected)/superadmin/hook/company/useDeleteCompany";
import { useActivateCompany } from "../../../hook/company/useCompanyActivate";
import CompanyEditHeader from "./CompanyEditHeader";
import CompanyEditForm from "./CompanyEditForm";
import CompanyAssignmentTabs from "./CompanyAssignmentTabs";
import CompanyEditLoading from "./CompanyEditLoading";

interface CompanyPageProps {
  params: { id: string };
}

export default function CompanyEditPage({ params }: CompanyPageProps) {
  const { id } = params;
  const router = useRouter();
  const { company, loading, error, updateCompany } = useCompany(id);
  const { deleteCompany, loading: deleting } = useDeleteCompany();
  const { activateCompany, loading: activating, error: activateError } = useActivateCompany();
  
  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    razonSocial: "",
    country: "",
    city: "",
    address: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactPhoneCountryCode: "+57",
    contactFirstName: "",
    contactLastName: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        nit: company.nit || "",
        razonSocial: company.razonSocial || "",
        country: company.country || "",
        city: company.city || "",
        address: company.address || "",
        logoUrl: company.logoUrl || "",
        contactEmail: company.contactEmail || "",
        contactPhone: company.contactPhone || "",
        contactPhoneCountryCode: company.contactPhoneCountryCode || "+57",
        contactFirstName: company.contactFirstName || "",
        contactLastName: company.contactLastName || "",
      });
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateCompany(formData);
      if (!success) {
        toast.error("Error al guardar los cambios");
        return;
      }
      toast.success("Cambios guardados correctamente");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!company?.id) {
      toast.error("No se encontró la compañía para activar.");
      return;
    }
    try {
      await activateCompany(company.id);
      toast.success("Compañía activada correctamente");
      router.push("/superadmin/page/companies");
    } catch (err: any) {
      toast.error(activateError || err.message || "Error al activar la compañía");
    }
  };

  const handleDeleteSuccess = () => {
    router.push("/superadmin/page/companies");
  };

  const handleCancel = () => {
    router.push("/superadmin/page/companies");
  };

  if (loading) return <CompanyEditLoading />;

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          Error: {error || "Compañía no encontrada"}
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-full">
      <CompanyEditHeader 
        companyName={company.name}
        logoUrl={company.logoUrl}
      />
      
      <div className="w-full p-2 pt-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyEditForm
          formData={formData}
          company={company}
          activating={activating}
          saving={saving}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onActivate={handleActivate}
          onDelete={handleDeleteSuccess}
          onCancel={handleCancel}
        />

        <CompanyAssignmentTabs 
          companyId={id}
          companyName={company.name}
        />
      </div>
    </main>
  );
}