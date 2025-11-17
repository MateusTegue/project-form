import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${process.env.BACKEND_API_URL}/api/v1/auth/generate-otp`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      data: response.data?.result?.data || response.data,
      message: response.data?.result?.message || "Código OTP generado exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error al generar código OTP",
        message: error.response?.data?.result?.message || error.message,
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

