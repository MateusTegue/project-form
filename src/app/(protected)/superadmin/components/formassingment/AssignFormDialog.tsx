'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import AssignFormDialogConfig from './AssignFormDialogConfig';
import { AssignFormDialogProps } from '../../types/models';


export default function AssignFormDialog({ isOpen, onClose, template, companyName, onConfirm, isAssigning}: AssignFormDialogProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const handleConfirm = () => {
    onConfirm({
      allowMultipleSubmissions: allowMultiple,
      allowEditAfterSubmit: allowEdit,
      expiresAt: expiresAt || undefined,
      welcomeMessage: welcomeMessage || undefined
    });
  };

  const handleClose = () => {
    if (!isAssigning) {
      // Reset state
      setShowAdvanced(false);
      setAllowMultiple(false);
      setAllowEdit(false);
      setExpiresAt('');
      setWelcomeMessage('');
      onClose();
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[30vw] max-w-xl overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Confirmar asignación
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Estás a punto de asignar el formulario{' '}
            <span  className="font-semibold text-foreground">
              {template.name}
            </span>{' '}
            a la empresa{' '}
            <span className="font-semibold text-foreground">{companyName}</span>.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta acción permitirá que la empresa acceda a los módulos y campos asociados a este formulario.
            </p>
          </div>

          {/* Esta parte todavía está en desarrollo. */}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full gap-2"
          >
            <Settings className="h-4 w-4" />
            {showAdvanced ? 'Ocultar' : 'Mostrar'} configuración avanzada
          </Button> */}

          {showAdvanced && (
            <AssignFormDialogConfig
              allowMultiple={allowMultiple}
              setAllowMultiple={setAllowMultiple}
              allowEdit={allowEdit}
              setAllowEdit={setAllowEdit}
              expiresAt={expiresAt}
              setExpiresAt={setExpiresAt}
              welcomeMessage={welcomeMessage}
              setWelcomeMessage={setWelcomeMessage}
            />
          )}
        </div>

        <Separator />

        <DialogFooter className="gap-4 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isAssigning}
            className="gap-2"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Confirmar asignación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}