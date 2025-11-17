import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(`${process.env.BACKEND_API_URL}/api/v1/admin`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error al obtener usuarios",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}