'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, RefreshCw, Edit, MessageSquare } from 'lucide-react';
import { AssignFormDialogConfigProps } from '../../types/models';


export default function AssignFormDialogConfig({
  allowMultiple,
  setAllowMultiple,
  allowEdit,
  setAllowEdit,
  expiresAt,
  setExpiresAt,
  welcomeMessage,
  setWelcomeMessage
}: AssignFormDialogConfigProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Allow Multiple Submissions */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="allowMultiple" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              Permitir múltiples envíos
            </Label>
            <p className="text-sm text-muted-foreground">
              Permite que la empresa envíe el formulario más de una vez
            </p>
          </div>
          <Switch
            id="allowMultiple"
            checked={allowMultiple}
            onCheckedChange={setAllowMultiple}
          />
        </div>

        {/* Allow Edit After Submit */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="allowEdit" className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              Permitir edición después de enviar
            </Label>
            <p className="text-sm text-muted-foreground">
              Permite editar las respuestas después del envío inicial
            </p>
          </div>
          <Switch
            id="allowEdit"
            checked={allowEdit}
            onCheckedChange={setAllowEdit}
          />
        </div>

        {/* Expiration Date */}
        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Fecha de expiración (opcional)
          </Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            placeholder="Selecciona una fecha"
          />
          <p className="text-xs text-muted-foreground">
            Después de esta fecha, el formulario no estará disponible
          </p>
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Mensaje de bienvenida (opcional)
          </Label>
          <Textarea
            id="welcomeMessage"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Escribe un mensaje personalizado para la empresa..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Este mensaje aparecerá al inicio del formulario
          </p>
        </div>
      </CardContent>
    </Card>
  );
}