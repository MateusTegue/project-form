import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "ID del formulario no proporcionado" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/api/v1/form-templates/${id}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );


    // Retornar directamente la respuesta del backend (ya tiene estructura correcta)
    return NextResponse.json(response.data);

  } catch (error: any) {
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Error al obtener el formulario",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
