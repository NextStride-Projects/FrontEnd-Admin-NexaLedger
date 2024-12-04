import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { serialize } from 'cookie';

interface LoginResponse {
  token: string;
  expires: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { adminKey } = await req.json();

  try {
    // Send a request to the external API
    const response = await axios.post<LoginResponse>(
      `http://localhost:7001/api/Auth/login/admin?adminKey=${adminKey}`
    );

    const { token } = response.data;

    // Set the JWT token in an HTTP-only cookie
    const res = NextResponse.json({ message: 'Login successful' });

    res.headers.append(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
    );

    return res;
  } catch (error) {
    // Handle Axios errors explicitly
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      const errorMessage = axiosError.response?.data
        ? (axiosError.response.data as string) // Assuming backend sends a string message
        : 'Invalid credentials';

      const errorStatus = axiosError.response?.status || 500;

      return NextResponse.json(
        { message: errorMessage },
        { status: errorStatus }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
