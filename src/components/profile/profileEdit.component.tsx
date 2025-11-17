import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { authService } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCompany } from "@/app/(protected)/superadmin/hook/company/useEditCompany";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export default function ProfileEditComponent({ params }: CompanyPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState<"SUPER_ADMIN" | "COMPANY">("COMPANY");
  
  // Resolver los params asíncronos
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    
    resolveParams();
  }, [params]);

  const { company, loading, updateCompany } = useCompany(resolvedParams?.id || "");

  const [formData, setFormData] = useState({
    // Campos para USER (SUPER_ADMIN, etc.)
    firstName: "",
    firstMiddleName: "",
    email: "",
    phone: "",
    username: "",
    codePhone: "",
    
    // Campos para COMPANY
    name: "",
    nit: "",
    razonSocial: "",
    country: "",
    city: "",
    address: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactPhoneCountryCode: "",
    contactFirstName: "",
    contactLastName: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del usuario actual
  useEffect(() => {
    const user = authService.getCurrentUser();
    const role = authService.getUserRole();
    
    setUserRole(role);
    
    // Detectar tipo de usuario basado en la estructura de datos
    if (user?.contactEmail || user?.nit) {
      setUserType("COMPANY");
    } else {
      setUserType("SUPER_ADMIN");
    }

    if (user) {
      if (userType === "SUPER_ADMIN") {
        // Cargar datos para usuarios normales
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || "",
          firstMiddleName: user.firstMiddleName || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || "",
          codePhone: user.codePhone || "+57"
        }));
      } else {
        // Cargar datos para empresas
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          nit: user.nit || "",
          razonSocial: user.razonSocial || "",
          country: user.country || "",
          city: user.city || "",
          address: user.address || "",
          logoUrl: user.logoUrl || "",
          contactEmail: user.contactEmail || "",
          contactPhone: user.contactPhone || "",
          contactPhoneCountryCode: user.contactPhoneCountryCode || "+57",
          contactFirstName: user.contactFirstName || "",
          contactLastName: user.contactLastName || ""
        }));
      }
    }
  }, [userType]);

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
      
       const endpoint = userType === "COMPANY" 
            ? `/api/company/${currentUser?.id}` 
            : "/api/profile";

      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response?.json();

      if (response.ok) {
        // Actualizar localStorage con los nuevos datos
        const currentUser = authService.getCurrentUser();
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
        throw new Error(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar formulario para COMPANY
  const renderCompanyForm = () => (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="">
          <label className="block text-sm font-medium mt-4">Nombre de la empresa</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre de la empresa"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mt-4">NIT</label>
          <input
            type="text"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="NIT de la empresa"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mt-4">Razón Social</label>
        <input
          type="text"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Razón social"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div>
          <label className="block text-sm font-medium mt-4">País</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="País"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mt-4">Ciudad</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ciudad"
          />
        </div>
        
      </div>

      <div>
        <label className="block text-sm font-medium mt-4">Dirección</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dirección completa"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mt-4">Email de contacto</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contacto@empresa.com"
          />
        </div>
     

        <div>
          <label className="block text-sm font-medium mt-4">Teléfono de contacto</label>
          <div className="relative">
            <select
              name="contactPhoneCountryCode"
              value={formData.contactPhoneCountryCode}
              onChange={handleChange}
              className="absolute left-0 top-0 h-full w-20 p-1 border border-gray-300 rounded-l-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-r-0"
            >
              <option value="+57">+57</option>
              <option value="+1">+1</option>
              <option value="+34">+34</option>
              <option value="+52">+52</option>
            </select>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full p-1 pl-24 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número de teléfono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mt-4">Nombre del contacto</label>
          <input
            type="text"
            name="contactFirstName"
            value={formData.contactFirstName}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del contacto"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mt-4">Apellido del contacto</label>
          <input
            type="text"
            name="contactLastName"
            value={formData.contactLastName}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apellido del contacto"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mt-4">URL del logo</label>
        <input
          type="url"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://ejemplo.com/logo.png"
        />
      </div>
    </div>
  );

  // Renderizar formulario para USER
  const renderUserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mt-4">Primer Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu primer nombre"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mt-4">Primer Apellido</label>
          <input
            type="text"
            name="firstMiddleName"
            value={formData.firstMiddleName}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu primer apellido"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mt-4">Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mt-4">Código país</label>
          <select
            name="codePhone"
            value={formData.codePhone}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="+57">+57 Colombia</option>
            <option value="+1">+1 USA</option>
            <option value="+34">+34 España</option>
            <option value="+52">+52 México</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mt-4">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="300 123 4567"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mt-4">Nombre de usuario</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="tu_usuario"
        />
      </div>
    </div>
  );

  const getDisplayName = () => {
    if (userType === "COMPANY") {
      return formData.name || "Empresa";
    } else {
      return `${formData.firstName} ${formData.firstMiddleName}`.trim() || "Usuario";
    }
  };

  const getAvatarFallback = () => {
    if (userType === "COMPANY") {
      return formData.name?.substring(0, 2).toUpperCase() || "EM";
    } else {
      return `${formData.firstName?.charAt(0) || ""}${formData.firstMiddleName?.charAt(0) || ""}`.toUpperCase() || "US";
    }
  };

  return (
    <div className="w-full mx-auto h-full flex flex-col md:flex-row gap-8 justify-center items-start p-6  ">
      {error && (
        <div className="mt-4 p-1 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="w-full md:w-2/3 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 h-14 flex items-center px-6">
          <h1 className="text-lg font-medium text-primary">Editar perfil</h1>
        </div>

        <div className="bg-white p-6 flex flex-col gap-6">
          {userType === "COMPANY" ? renderCompanyForm() : renderUserForm()}

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-[18%] self-end px-2 py-2 bg-primary text-white rounded-md font-semibold
                      hover:opacity-90 transition-opacity duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 p-6 bg-white rounded-sm shadow">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 mt-4">
            <AvatarImage 
              src={userType === "COMPANY" ? formData.logoUrl : "https://github.com/shadcn.png"} 
              alt="Avatar"
              className="rounded-3xl object-cover"
            />
            <AvatarFallback className="rounded-3xl bg-gray-200 text-gray-600 text-2xl font-bold">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-center">
            {getDisplayName()}
          </h2>
          <p className="text-gray-500 capitalize text-center">
            {userRole.toLowerCase().replace('_', ' ')}
          </p>
          {userType === "COMPANY" && formData.razonSocial && (
            <p className="text-gray-600 text-sm text-center mt-2">
              {formData.razonSocial}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}