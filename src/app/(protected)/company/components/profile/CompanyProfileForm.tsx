"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Building2, User } from "lucide-react";
import CompanyProfileSidebar from "./CompanyProfileSidebar";
import CompanyInfoSection from "./CompanyInfoSection";
import ContactInfoSection from "./ContactInfoSection";

export default function CompanyProfileForm() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    razonSocial: "",
    country: "",
    city: "",
    address: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactPhoneCountryCode: "+57",
    contactFirstName: "",
    contactLastName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Cargar datos de la compañía actual
  useEffect(() => {
    const loadCompanyData = () => {
      try {
        const company = authService.getCurrentUser();
        if (company) {
          setFormData({
            name: company.name || "",
            nit: company.nit || "",
            razonSocial: company.razonSocial || "",
            country: company.country || "Colombia",
            city: company.city || "",
            address: company.address || "",
            logoUrl: company.logoUrl || "",
            contactEmail: company.contactEmail || "",
            contactPhone: company.contactPhone || "",
            contactPhoneCountryCode: company.contactPhoneCountryCode || "+57",
            contactFirstName: company.contactFirstName || "",
            contactLastName: company.contactLastName || ""
          });
        }
      } catch (err) {
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser?.id) {
        throw new Error("No se encontró información del usuario");
      }

      const response = await fetch(`/api/company/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response?.json();

      if (response.ok) {
        // Actualizar localStorage con los nuevos datos
        const updatedUser = { 
          ...currentUser, 
          ...formData
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("Perfil actualizado correctamente");
        
        // Recargar para reflejar cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || data.error || "Error al actualizar el perfil");
      }
    } catch (error: any) {
      setError(error.message || "Error al actualizar el perfil");
      toast.error(error.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Izquierdo - Perfil */}
          <CompanyProfileSidebar
            formData={formData}
            isLoading={isLoading}
            onSave={handleSave}
          />

          {/* Área Principal Derecha - Formulario */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Información de la Empresa
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información de Contacto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="mt-0">
                <CompanyInfoSection
                  formData={formData}
                  onChange={handleChange}
                />
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                <ContactInfoSection
                  formData={formData}
                  onChange={handleChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
