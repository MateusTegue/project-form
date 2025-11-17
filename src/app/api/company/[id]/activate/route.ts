import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    
    const response = await axios.patch(
      `${process.env.BACKEND_API_URL}/api/v1/companies/${id}/activate`,
      {},
      { 
        headers: { "Content-Type": "application/json" } 
      }
    );

    return NextResponse.json({ data: response.data });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error al activar la compañía",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}