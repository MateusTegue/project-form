"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionStatus } from "../../types/models";
import { SagridocsEmptyProps } from "../../types/models";
import toast from "react-hot-toast";

const statusLabels: Record<SubmissionStatus, string> = {
  PENDIENTE: "Pendientes",
  PROCESANDO: "En proceso",
  PROCESADO: "Procesados",
  ELIMINADO: "Eliminados",
};

const alertHandler = () => {
  toast('</> Funcionalidad en desarrollo')
}

export default function SagridocsEmpty({ searchQuery, currentStatus, onClearSearch }: SagridocsEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 font-medium text-lg mb-2">
          {searchQuery 
            ? 'No se encontraron resultados' 
            : `No hay formularios ${statusLabels[currentStatus]?.toLowerCase() || 'en este estado'}`}
        </p>
        {searchQuery && (
          <Button 
            variant="link" 
            onClick={onClearSearch}
            className="mt-2"
          >
            Limpiar búsqueda
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}