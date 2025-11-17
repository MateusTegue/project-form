import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const { companyId } = await params;

    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/api/v1/company-form-assignments/${companyId}`
    );

    return NextResponse.json({ data: response.data.result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener asignaciones", details: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
