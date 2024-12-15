import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cookie from "cookie";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ empresaId: string }> }
) {
  const { empresaId } = await params;

  try {
    const { motive } = await req.json();

    if (!motive) {
      return NextResponse.json(
        { message: "Motive is required." },
        { status: 400 }
      );
    }

    const cookiesHeader = req.headers.get("cookie");
    const cookies = cookiesHeader ? cookie.parse(cookiesHeader) : {};
    const token = cookies.token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token not found." },
        { status: 401 }
      );
    }

    try {
      const response = await axios.put(
        `http://localhost:7001/api/Auth/deactivate/empresa/${empresaId}?motive=${encodeURIComponent(
          motive
        )}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return NextResponse.json({
        message: "Empresa deactivated successfully!",
        data: response.data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error deactivating empresa:", axiosError.message);
      return NextResponse.json(
        {
          message: `Failed to deactivate empresa: ${
            axiosError.response?.data || "Unknown error."
          }`,
        },
        { status: axiosError.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}
