'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginButton from './LoginButton';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';


export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const result = await authService.login(identifier, password);

    if (!result || !result.data) {
      throw new Error("Error en la respuesta del servidor");
    }

    const user = result.data?.user;
    if (!user) {
      throw new Error("No se recibió información del usuario");
    }

    const roleName = user?.role?.name;
    // Determinar la ruta de redirección según el rol
    let redirectPath = '/';
    if (roleName) {
      switch (roleName) {
        case 'SUPER_ADMIN':
        case 'ADMIN_ALIADO':
          redirectPath = '/superadmin/page/dashboard';
          break;
        case 'COMPANY':
          redirectPath = '/company/page/dashboard';
          break;
        default:
          redirectPath = '/';
          break;
      }
    }
    // Las cookies httpOnly (auth_token) no son accesibles desde JavaScript
    // pero se enviarán automáticamente en la siguiente petición
    // Esperar un momento para que el navegador procese las cookies y luego redirigir
    // Usar window.location.replace para evitar que el usuario pueda volver atrás
    // Aumentar el delay para asegurar que las cookies se establezcan
    setTimeout(() => {
      try {
        // Forzar una redirección completa
        window.location.href = redirectPath;
      } catch (error) {
        // Si falla, intentar con replace
        window.location.replace(redirectPath);
      }
    }, 1000);

  } catch (err: any) {
    setError(err.message || "Error al iniciar sesión");
    setLoading(false);
  }
};

  return (
    <div className=" flex items-center justify-center ">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Bienvenido de Nuevo</CardTitle>
          <CardDescription className="text-sm text-center">
            Ingresa tus credenciales para acceder al dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                   {error === "CredentialsSignin"
                    ? "Correo o contraseña incorrectos"
                    : error}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label className="text-md" htmlFor="email">Correo Electrónico</Label>
                <Input 
                  className="w-full h-11 text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/50"
                  id="email"
                  type="email"
                  placeholder="admin@test.com"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-md" htmlFor="password">Contraseña</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-md underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    className="w-full h-11 text-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/50 pr-10"
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <CardFooter className="p-0 pt-6">
               <LoginButton loading={loading} />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}