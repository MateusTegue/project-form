import { Building, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useFormTemplateCount } from "../../hook/formtemplate/useFormTemplateCount";

export default function FormCard() {
  const { count, loading, error } = useFormTemplateCount();

  return (
     <Card className="w-[400px]  border border-border shadow-sm bg-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Formularios</CardTitle>
          <File size={16} className="text-gray-600" />
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
                {count === 1 ? "Formulario registrado" : "Formularios registrados"}
              </CardDescription>
            </>
          )}
        </CardContent>
          <Link href="/superadmin/page/formstemplates" className="w-full text-center">
            formularios
          </Link>
      </Card>
  );
}
