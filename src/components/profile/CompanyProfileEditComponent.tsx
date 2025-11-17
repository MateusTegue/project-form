import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function CompanyProfileEditComponent() {
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

  // Cargar datos de la compañía actual
  useEffect(() => {
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
      
      const response = await fetch("/api/company/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar localStorage con los nuevos datos
        const currentCompany = authService.getCurrentUser();
        const updatedCompany = { 
          ...currentCompany, 
          ...formData
        };
        localStorage.setItem("user", JSON.stringify(updatedCompany));
        
        toast.success("Perfil de empresa actualizado correctamente");
        
        // Recargar para reflejar cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-full flex flex-col md:flex-row gap-8 justify-center items-start p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Editar Perfil de Empresa</h1>
        
        <div className="space-y-6">
          {/* Información de la Empresa */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Información de la Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de la Empresa:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de la empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">NIT:</label>
                <input
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NIT de la empresa"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Razón Social:</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Razón social completa"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">País:</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Colombia">Colombia</option>
                  <option value="México">México</option>
                  <option value="España">España</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ciudad:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ciudad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dirección:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dirección completa"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Persona de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Contacto:</label>
                <input
                  type="text"
                  name="contactFirstName"
                  value={formData.contactFirstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Apellido del Contacto:</label>
                <input
                  type="text"
                  name="contactLastName"
                  value={formData.contactLastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apellido"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Email de Contacto:</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contacto@empresa.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Código País:</label>
                <select
                  name="contactPhoneCountryCode"
                  value={formData.contactPhoneCountryCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="+57">+57 Colombia</option>
                  <option value="+1">+1 USA/Canadá</option>
                  <option value="+34">+34 España</option>
                  <option value="+52">+52 México</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono de Contacto:</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teléfono"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">URL del Logo:</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
        </div>
        
        <div className="pt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
      
      {/* Sidebar con información */}
      <div className="w-full md:w-1/3 p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage 
              src={formData.logoUrl || "https://github.com/shadcn.png"} 
              alt="Logo de la empresa"
              className="rounded-3xl object-cover"
            />
            <AvatarFallback className="rounded-3xl bg-gray-200 flex items-center justify-center">
              {formData.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'CO'}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-center">{formData.name}</h2>
          <p className="text-gray-500 text-center">NIT: {formData.nit}</p>
          <p className="text-gray-500 text-center">{formData.razonSocial}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Contacto:</strong> {formData.contactFirstName} {formData.contactLastName}</p>
            <p><strong>Email:</strong> {formData.contactEmail}</p>
            <p><strong>Teléfono:</strong> {formData.contactPhoneCountryCode} {formData.contactPhone}</p>
            <p><strong>Ubicación:</strong> {formData.city}, {formData.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}