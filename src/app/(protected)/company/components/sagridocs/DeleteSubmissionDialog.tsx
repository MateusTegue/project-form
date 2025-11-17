"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Submission } from "../../types/models";
import toast from "react-hot-toast";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteSubmissionDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export default function DeleteSubmissionDialog({
  submission,
  open,
  onOpenChange,
  onDeleted,
}: DeleteSubmissionDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!submission) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la respuesta");
      }

      toast.success("Respuesta marcada como eliminada. Ya no aparecerá en la lista.");
      onDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la respuesta");
    } finally {
      setLoading(false);
    }
  };

  if (!submission) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>¿Eliminar respuesta?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Estás a punto de marcar como eliminada la respuesta enviada por{" "}
                <strong>{submission.submitterName || submission.submitterEmail}</strong>.
                La respuesta dejará de aparecer en la lista, pero los datos se conservarán en el sistema.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-medium mb-2">ℹ️ Información</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li>Se realizará un borrado lógico (el estado cambiará a "ELIMINADO")</li>
            <li>La respuesta dejará de aparecer en las listas por defecto</li>
            <li>Los datos se conservan en la base de datos y pueden ser recuperados si es necesario</li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Sí, eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

