"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ExternalLink, CheckCircle2 } from "lucide-react";
import { IntegrationItemProps } from "../../types/models";

export default function IntegrationsItem({ title, description, param, enabled = false }: IntegrationItemProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    // Aquí se puede agregar lógica para guardar el estado de la integración
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {title}
              </CardTitle>
              {isEnabled && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Activa
                </Badge>
              )}
            </div>
            <CardDescription className="text-base text-gray-600 mt-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{param}</span>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Estado:</span>
          <span className={`font-medium ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
            {isEnabled ? 'Habilitada' : 'Deshabilitada'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            // Aquí se puede agregar lógica para abrir la configuración de la integración
          }}
        >
          <Settings className="w-4 h-4" />
          Configurar
        </Button>
      </CardFooter>
    </Card>
  );
}