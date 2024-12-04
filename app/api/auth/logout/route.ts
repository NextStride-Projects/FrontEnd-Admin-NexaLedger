import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });

  response.cookies.set('token', '', {
    maxAge: -1,
    path: '/',
  });

  return response;
}
