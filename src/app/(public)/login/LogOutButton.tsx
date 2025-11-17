import { authService } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LogOutButton() {
  const handleLogOut = async () => {
    toast((t) => (
      <div className="flex flex-col items-center p-2">
        <p className="font-medium mb-3">¿Estás seguro de cerrar sesión?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                toast.dismiss(t.id);
                await authService.logout();
                toast.success('Sesión cerrada correctamente');
              } catch (error) {
                toast.error('Error al cerrar sesión');
                window.location.href = '/login';
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Sí, cerrar sesión
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  return (
    <button
      className="flex items-center gap-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
      onClick={handleLogOut} 
    >
      <LogOut className="w-4 h-4" />
      <span className="text-md font-medium">Cerrar Sesión</span>
    </button>
  );
}


 