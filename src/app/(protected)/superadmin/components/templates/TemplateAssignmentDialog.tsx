import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2 } from "lucide-react";

export function FormAssignmentDialog({
  open,
  onOpenChange,
  template,
  companyName,
  onConfirm,
  assigning,
}: any) {
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleConfirm = () =>
    onConfirm({
      allowMultipleSubmissions: allowMultiple,
      allowEditAfterSubmit: allowEdit,
      expiresAt: expiresAt || undefined,
      customConfig: welcomeMessage ? { welcomeMessage } : undefined,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Configurar Asignación
          </DialogTitle>
          <DialogDescription>
            Asignar <strong>{template?.name}</strong> a <strong>{companyName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-sm">Opciones</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir múltiples envíos</Label>
                <p className="text-xs text-muted-foreground">
                  La empresa puede enviar varias veces
                </p>
              </div>
              <Switch checked={allowMultiple} onCheckedChange={setAllowMultiple} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir edición</Label>
                <p className="text-xs text-muted-foreground">Puede editar después</p>
              </div>
              <Switch checked={allowEdit} onCheckedChange={setAllowEdit} />
            </div>

            <div>
              <Label>Fecha de expiración (opcional)</Label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div>
              <Label>Mensaje de bienvenida (opcional)</Label>
              <Textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Mensaje personalizado..."
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={assigning}>
            {assigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
