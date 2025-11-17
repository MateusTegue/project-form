"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText, MapPin, Mail, Phone, Save, Loader2 } from "lucide-react";

interface CompanyProfileSidebarProps {
  formData: {
    name: string;
    nit: string;
    razonSocial: string;
    country: string;
    city: string;
    logoUrl: string;
    contactEmail: string;
    contactPhone: string;
    contactPhoneCountryCode: string;
  };
  isLoading: boolean;
  onSave: () => void;
}

export default function CompanyProfileSidebar({
  formData,
  isLoading,
  onSave,
}: CompanyProfileSidebarProps) {
  const getAvatarFallback = () => {
    return formData.name?.substring(0, 2).toUpperCase() || "EM";
  };

  return (
    <div className="lg:col-span-1">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage 
                  src={formData.logoUrl} 
                  alt={formData.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 text-slate-600 text-3xl font-bold">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Nombre */}
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {formData.name || "Empresa"}
              </h2>
              {formData.razonSocial && (
                <p className="text-sm text-slate-600 mb-4 break-words">
                  {formData.razonSocial}
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="w-full space-y-3 text-left">
              {formData.nit && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>NIT: {formData.nit}</span>
                </div>
              )}
              {formData.country && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{formData.city ? `${formData.city}, ` : ''}{formData.country}</span>
                </div>
              )}
              {formData.contactEmail && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{formData.contactEmail}</span>
                </div>
              )}
              {formData.contactPhone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{formData.contactPhoneCountryCode} {formData.contactPhone}</span>
                </div>
              )}
            </div>

            {/* Botón de acción */}
            <div className="w-full pt-4 border-t border-slate-200">
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

