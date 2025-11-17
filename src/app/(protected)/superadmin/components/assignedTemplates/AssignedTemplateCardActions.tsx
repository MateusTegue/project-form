'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, XCircle, AlertTriangle } from 'lucide-react';

interface AssignedTemplateCardActionsProps {
  assignmentId: string;
  templateName: string;
  onRemove: (assignmentId: string, templateName: string) => void;
  unassigning: boolean;
}

export default function AssignedTemplateCardActions({
  assignmentId,
  templateName,
  onRemove,
  unassigning
}: AssignedTemplateCardActionsProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="w-full gap-2"
          disabled={unassigning}
        >
          {unassigning ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Desasignando...
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Desasignar
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>¿Desasignar formulario?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Estás a punto de desasignar <strong>"{templateName}"</strong>.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
          <p>⚠️ La empresa perderá acceso a este formulario inmediatamente.</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onRemove(assignmentId, templateName)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, desasignar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}