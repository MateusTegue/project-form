"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface ContactInfoSectionProps {
  formData: {
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
    contactPhoneCountryCode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ContactInfoSection({
  formData,
  onChange,
}: ContactInfoSectionProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Información de Contacto
        </CardTitle>
        <CardDescription>
          Datos de la persona de contacto
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactFirstName" className="text-sm font-semibold text-slate-700">
              Nombre del Contacto
            </Label>
            <Input
              id="contactFirstName"
              name="contactFirstName"
              value={formData.contactFirstName}
              onChange={onChange}
              placeholder="Nombre del contacto"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactLastName" className="text-sm font-semibold text-slate-700">
              Apellido del Contacto
            </Label>
            <Input
              id="contactLastName"
              name="contactLastName"
              value={formData.contactLastName}
              onChange={onChange}
              placeholder="Apellido del contacto"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-sm font-semibold text-slate-700">
            Email de Contacto
          </Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={onChange}
            placeholder="contacto@empresa.com"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="text-sm font-semibold text-slate-700">
            Teléfono de Contacto
          </Label>
          <div className="flex gap-2">
            <select
              name="contactPhoneCountryCode"
              value={formData.contactPhoneCountryCode}
              onChange={onChange}
              className="h-10 w-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <option value="+57">+57</option>
              <option value="+1">+1</option>
              <option value="+34">+34</option>
              <option value="+52">+52</option>
            </select>
            <Input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={onChange}
              placeholder="Número de teléfono"
              className="flex-1 h-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

