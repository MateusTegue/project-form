"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface CompanyPublicErrorProps {
  error: string;
}

export default function CompanyPublicError({ error }: CompanyPublicErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-destructive flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">{error || "Empresa no encontrada"}</p>
        </CardContent>
      </Card>
    </div>
  );
}

