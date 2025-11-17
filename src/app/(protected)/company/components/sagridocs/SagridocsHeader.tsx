"use client";
import React from "react";
import { FileText, Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SagridocsHeaderProps } from "../../types/models";


export default function SagridocsHeader({  submissionsCount,  loading,  onExport, onRefresh }: SagridocsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-md font-bold text-slate-900 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          Sagridoc
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Cargando...
            </span>
          ) : (
            `${submissionsCount} formulario${submissionsCount !== 1 ? 's' : ''} encontrado${submissionsCount !== 1 ? 's' : ''}`
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar a Excel
        </Button>
      </div>
    </div>
  );
}