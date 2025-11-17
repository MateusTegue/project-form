import { Building, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useModulesCount } from "../../hook/modules/useModulesCount";
import { Skeleton } from "@/components/ui/skeleton";

export default function ModulesShowCard() {
  const { count, loading, error } = useModulesCount();

  return (
     <Card className="w-[400px]  border border-border shadow-sm bg-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Módulos</CardTitle>
          <Layers size={16} className="text-gray-600" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-8 w-16 " />
              <CardDescription className="text-xs text-gray-500">Cargando...</CardDescription>
            </>
          ) : error ? (
            <CardDescription className="text-xs text-red-500 ">
              Error al cargar
            </CardDescription>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold text-gray-900 ">
                {count || 0}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                {count === 1 ? "Módulo registrado" : "Módulos registrados"}
              </CardDescription>
            </>
          )}
        </CardContent>
          <Link href="/superadmin/page/modules" className="w-full text-center">
            módulos
          </Link>
      </Card>
  );
}