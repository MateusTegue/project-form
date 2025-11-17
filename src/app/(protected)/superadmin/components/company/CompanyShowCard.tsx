"use client";

import { Building } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCompaniesCount } from '../../hook/company/useCompaniesCount';
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyShowCard() {
  const { count, loading, error } = useCompaniesCount();

  return (
      <Card className="w-[400px]  border border-border shadow-sm bg-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Empresas</CardTitle>
          <Building size={16} className="text-gray-600" />
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
                {count === 1 ? "Empresa registrada" : "Empresas registradas"}
              </CardDescription>


           
              
            </>
          )}
        </CardContent>

     
          <Link href="/superadmin/page/companies" className="w-full text-center">
            Ver empresas
          </Link>
      
      </Card>
  );
}


