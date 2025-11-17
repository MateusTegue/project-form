"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationsItem from "./IntegrationsItem";
import RedirectUrlConfig from "./RedirectUrlConfig";
import { Plug, Globe } from "lucide-react";

const integrations = [
  { 
    title: "📄  Slack", 
    description: "Gestión de riesgos LAFT/FPADM. Automatiza la debida diligencia de terceros.", 
    param: "Parametros",
    enabled: true 
  },
];

export default function IntegrationsList() {
  return (
    <div className="w-full h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[95%] mx-auto py-6 space-y-5">
        {/* Header Compacto */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Plug className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Marketplace de Integraciones
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Configura y gestiona las integraciones de tu empresa para mejorar la experiencia de tus usuarios.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs para organizar las secciones */}
        <Tabs defaultValue="public-page" className="w-full">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 mb-4 bg-white border border-slate-200 shadow-sm">
            <TabsTrigger value="public-page" className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              Página Pública
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 text-sm">
              <Plug className="w-4 h-4" />
              Integraciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public-page" className="mt-0">
            <RedirectUrlConfig />
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.length > 0 ? (
                integrations.map((item, index) => (
                  <IntegrationsItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    param={item.param}
                    enabled={item.enabled}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Plug className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No hay integraciones disponibles</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Las nuevas integraciones estarán disponibles próximamente
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
