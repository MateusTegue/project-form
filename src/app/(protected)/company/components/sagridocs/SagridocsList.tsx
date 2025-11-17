"use client";
import { useState, useEffect } from "react";
import { useGetSubmissions } from "../../hook/getFormAssignedToCompany/useGetSummisions";
import { SubmissionStatus } from "../../types/models";
import { authService } from "@/lib/auth";
import SagridocsHeader from "./SagridocsHeader";
import SagridocsSearchBar from "./SagridocsSearchBar";
import SagridocsFilters from "./SagridocsFilters";
import SagridocsTable from "./SagridocsTable";
import SagridocsLoading from "./SagridocsLoading";
import { exportSubmissionsToExcel } from "@/lib/exportToExcel";
import toast from "react-hot-toast";


export default function SagridocsList() {
  const [companyId, setCompanyId] = useState<string>("");
  const [estado, setEstado] = useState<SubmissionStatus>("PENDIENTE");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      if (user?.id) {
        setCompanyId(user.id);
      }
    } catch (error) {
    }
  }, []);

  const { submissions, loading, refetch } = useGetSubmissions(
    companyId, 
    estado, 
    searchQuery
  );

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleExportToExcel = async () => {
    try {
      if (submissions.length === 0) {
        toast.error('No hay formularios para exportar');
        return;
      }

      toast.loading('Exportando a Excel...', { id: 'export-excel' });

      const statusLabels: Record<SubmissionStatus, string> = {
        PENDIENTE: "Pendientes",
        PROCESANDO: "En_Proceso",
        PROCESADO: "Procesados",
        ELIMINADO: "Eliminados",
      };

      const fileName = `formularios_${statusLabels[estado] || estado.toLowerCase()}`;
      
      await exportSubmissionsToExcel({
        submissions,
        fileName,
        fetchFullData: true, // Obtener datos completos de cada submission
      });

      toast.success(`Se exportaron ${submissions.length} formulario${submissions.length !== 1 ? 's' : ''} exitosamente`, { id: 'export-excel' });
    } catch (error: any) {
      toast.error(error.message || 'Error al exportar a Excel', { id: 'export-excel' });
    }
  };

  if (!companyId) {
    return <SagridocsLoading message="Cargando información de la empresa..." />;
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      <SagridocsHeader 
        submissionsCount={submissions.length}
        loading={loading}
        onExport={handleExportToExcel}
        onRefresh={refetch}
      />

      <SagridocsSearchBar 
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
      />

      <SagridocsFilters 
        currentStatus={estado}
        onStatusChange={setEstado}
      />

      <SagridocsTable 
        submissions={submissions}
        loading={loading}
        searchQuery={searchQuery}
        currentStatus={estado}
        onClearSearch={handleClearSearch}
        onRefresh={refetch}
      />
    </div>
  );
}