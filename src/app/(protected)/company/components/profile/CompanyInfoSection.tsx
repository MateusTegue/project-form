"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

interface CompanyInfoSectionProps {
  formData: {
    name: string;
    nit: string;
    razonSocial: string;
    country: string;
    city: string;
    address: string;
    logoUrl: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CompanyInfoSection({
  formData,
  onChange,
}: CompanyInfoSectionProps) {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Información de la Empresa
        </CardTitle>
        <CardDescription>
          Datos básicos de tu empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Nombre de la Empresa
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Nombre de la empresa"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nit" className="text-sm font-semibold text-slate-700">
              NIT
            </Label>
            <Input
              id="nit"
              name="nit"
              value={formData.nit}
              onChange={onChange}
              placeholder="NIT de la empresa"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="razonSocial" className="text-sm font-semibold text-slate-700">
            Razón Social
          </Label>
          <Input
            id="razonSocial"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={onChange}
            placeholder="Razón social"
            className="h-10"
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-semibold text-slate-700">
              País
            </Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={onChange}
              placeholder="País"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
              Ciudad
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="Ciudad"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
            Dirección
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            rows={3}
            placeholder="Dirección completa"
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl" className="text-sm font-semibold text-slate-700">
            URL del Logo
          </Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={formData.logoUrl}
            onChange={onChange}
            placeholder="https://ejemplo.com/logo.png"
            className="h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
}

