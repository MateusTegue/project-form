"use client";
import React from "react";
import { FileText, RefreshCw, Loader2, Clock, CheckCircle2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSubmissionStats } from "../../hook/getSubmissionStats/useGetSubmissionStats";
import { useGetFormAssignedToCompany } from "../../hook/getFormAssignedToCompany/useGetFormAssigned";

interface FormsHeaderProps {
  companyId: string;
  onRefresh?: () => void;
}

export default function FormsHeader({ companyId, onRefresh }: FormsHeaderProps) {
  const { stats, loading: statsLoading, refetch: refetchStats } = useGetSubmissionStats(companyId);
  const { assignments, loading: assignmentsLoading, refetch: refetchAssignments } = useGetFormAssignedToCompany(companyId);

  const handleRefresh = () => {
    refetchStats();
    refetchAssignments();
    if (onRefresh) {
      onRefresh();
    }
  };

  const isLoading = statsLoading || assignmentsLoading;

  return (
    <div className="w-full px-6 py-6 space-y-6 bg-slate-50">
      {/* Header principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Formularios Asignados
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Cargando...
              </span>
            ) : (
              `${assignments.length} formulario${assignments.length !== 1 ? 's' : ''} asignado${assignments.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas de submissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    stats?.total ?? 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:border-yellow-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    stats?.pendiente ?? 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:border-blue-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En Proceso</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    stats?.procesando ?? 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:border-green-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Procesados</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    stats?.procesado ?? 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

