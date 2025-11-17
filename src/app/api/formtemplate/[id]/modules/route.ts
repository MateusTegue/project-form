import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { requireRole, getAuthHeaders } from "@/lib/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y rol (SUPER_ADMIN o ADMIN_ALIADO)
    const authResult = requireRole(request, ['SUPER_ADMIN', 'ADMIN_ALIADO']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { token } = authResult;
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID del formulario no proporcionado" },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `${process.env.BACKEND_API_URL}/api/v1/form-templates/${id}/modules`,
      body,
      {
        headers: getAuthHeaders(token),
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error al actualizar los módulos del formulario",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

