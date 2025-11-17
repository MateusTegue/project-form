import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { requireRole, getAuthHeaders } from "@/lib/api-auth";

// obtener las empresas por estado inactivo
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación y rol (SUPER_ADMIN o ADMIN_ALIADO)
    const authResult = requireRole(req, ['SUPER_ADMIN', 'ADMIN_ALIADO']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { token } = authResult;

    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/api/v1/companies/status`,
      {
        headers: getAuthHeaders(token),
        withCredentials: true,
      }
    );
    
    // Si la respuesta es exitosa pero no hay datos, devolver array vacío
    const data = response.data?.data || response.data || [];
    const companies = Array.isArray(data) ? data : [];
    
    return NextResponse.json({ data: companies });
  } catch (error: any) {
    // Si el error es 404 o similar, devolver array vacío en lugar de error
    if (error.response?.status === 404) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json(
      {
        error: "Error al obtener las empresas",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
