"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TableRow, TableCell } from "@/components/ui/table";
import { MoreVertical, Eye, ArrowRight, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SagridocsItemProps } from "../../types/models";
import ChangeStatusDialog from "./ChangeStatusDialog";
import DeleteSubmissionDialog from "./DeleteSubmissionDialog";

export default function SagridocsItem({ submission, onStatusChanged }: SagridocsItemProps & { onStatusChanged?: () => void }) {
  const router = useRouter();
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const getAnswerValue = (fieldKey: string) => {
    const answer = submission.answers?.find((a) => a.fieldKey === fieldKey);
    return answer?.textValue || answer?.numberValue || '-';
  };

  const handleViewDetails = () => {
    router.push(`/company/page/sagridocs/${submission.id}`);
  };

  const handleChangeStatus = () => {
    setChangeStatusDialogOpen(true);
  };

  const handleStatusChanged = () => {
    if (onStatusChanged) {
      onStatusChanged();
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleted = () => {
    if (onStatusChanged) {
      onStatusChanged();
    }
  };

  // Calcular hace cuánto tiempo se envió
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const submitted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    return submitted.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <TableRow className="hover:bg-slate-50/50 transition-all duration-200 border-b border-slate-100">
      {/* Fecha */}
      <TableCell className="py-4 px-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">
            {new Date(submission.submittedAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </TableCell>

      {/* Razón Social */}
      <TableCell className="py-4 px-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-900">
            {getAnswerValue('razon_social')}
          </span>
        </div>
      </TableCell>

      {/* NIT */}
      <TableCell className="py-4 px-4">
        <span className="text-sm font-mono text-slate-700 px-2 py-1 rounded">
          {getAnswerValue('nitcedula')}
        </span>
      </TableCell>

      {/* Email */}
      <TableCell className="py-4 px-4">
        <a 
          href={`mailto:${submission.submitterEmail}`}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {submission.submitterEmail}
        </a>
      </TableCell>

      {/* Tipo de Tercero */}
      <TableCell className="py-4 px-4">
        <span className="font-normal">
          {getAnswerValue('tipo_tercero') || 'Cliente'}
        </span>
      </TableCell>

      {/* Acciones */}
      <TableCell className="py-4 px-4">
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                title="Opciones"
                aria-label="Opciones"
              >
                <MoreVertical className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleViewDetails}
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </DropdownMenuItem>
              {submission.status !== "PROCESADO" && submission.status !== "ELIMINADO" && (
                <>
                  <DropdownMenuItem
                    onClick={handleChangeStatus}
                    className="cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Mover
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Borrar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>

      {/* Dialogs */}
      <ChangeStatusDialog
        submission={submission}
        open={changeStatusDialogOpen}
        onOpenChange={setChangeStatusDialogOpen}
        onStatusChanged={handleStatusChanged}
      />
      <DeleteSubmissionDialog
        submission={submission}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={handleDeleted}
      />
    </TableRow>
  );
}