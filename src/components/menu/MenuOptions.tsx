import { Home, Users, FileText, Settings, Plug } from "lucide-react";

export const menuItems = {
    
  SUPER_ADMIN: [
    { key: "/superadmin/page/profile", label: "Perfil", icon: <Users className="w-4 h-4" /> },
    { key: "/superadmin/page/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { key: "/superadmin/page/companies", label: "Empresas", icon: <Plug className="w-4 h-4" /> },
    { key: "/superadmin/page/modules", label: "Módulos", icon: <FileText className="w-4 h-4" /> },
    { key: "/superadmin/page/formstemplates", label: "Formularios", icon: <FileText className="w-4 h-4" /> },
    // { key: "/superadmin/page/config", label: "Configuracion", icon: <Settings className="w-4 h-4" /> },
  ],


    
  COMPANY: [
    { key: "/company/page/profile", label: "Perfil", icon: <Users className="w-4 h-4" /> },
    { key: "/company/page/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { key: "/company/page/integrations", label: "Integraciones", icon: <Plug className="w-4 h-4" /> },
    { key: "/company/page/forms", label: "Formulario", icon: <FileText className="w-4 h-4" /> },
    { key: "/company/page/sagridocs", label: "Sagridocs", icon: <FileText className="w-4 h-4" /> },
    // { key: "/company/page/configurations", label: "Configuracion", icon: <Settings className="w-4 h-4" /> },
  ],
};
