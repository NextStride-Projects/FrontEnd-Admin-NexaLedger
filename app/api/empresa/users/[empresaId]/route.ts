import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cookie from "cookie";

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { userId } = await req.json();

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
      await axios.delete(
        `http://localhost:7001/api/UsuarioManager/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return NextResponse.json({ message: "Usuario deleted successfully!" });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error deleting user:", axiosError.message);
      return NextResponse.json(
        {
          message: `Failed to delete user: ${axiosError.response?.data || "Unknown error."}`,
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
