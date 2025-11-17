"use client";

import { useState } from "react";
import { useGetCompaniesByStatus } from '../../hook/company/useGetCompaniesByStatus';
import CreateCompanyButton from "./CreateCompanyButton";
import CompanyList from "./CompanyList";

export default function GestionCompaniesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>("ACTIVO");
  const { companies, loading, error } = useGetCompaniesByStatus(selectedStatus);

  const handleFilter = (status: string | null) => {
    setSelectedStatus(status);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Empresas</h1>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CreateCompanyButton />
        <h2 className="font-semibold text-md">{selectedStatus === "ACTIVO" ? "Activas" : selectedStatus === "INACTIVO" ? "Inactivas" : "Todas"}: {companies.length}</h2>
      </div>
      
      <CompanyList 
        companies={companies} 
        onFilter={handleFilter}
        loading={loading}
        error={error}
      />
    </div>
  );
}

