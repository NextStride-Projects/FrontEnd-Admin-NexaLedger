import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { serialize } from "cookie";

interface LoginResponse {
  token: string;
  expires: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { adminKey, ip } = await req.json();

  try {
    const response = await axios.post<LoginResponse>(
      `http://localhost:7001/api/Auth/login/admin`,
      { adminKey, ip }
    );

    const { token } = response.data;

    const res = NextResponse.json({ message: "Login successful" });

    res.headers.append(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
    );

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      const errorData = axiosError.response?.data;
      const errorMessage =
        typeof errorData === "string"
          ? errorData
          : (errorData as Error)?.message || "Invalid credentials";

      const errorStatus = axiosError.response?.status || 500;

      return NextResponse.json(
        { message: errorMessage },
        { status: errorStatus }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
