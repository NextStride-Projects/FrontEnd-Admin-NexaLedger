import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import LogsTable from "@/app/components/LogsTable";

// Function to decode and validate the token
function decodeAndValidateToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;

    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token structure");
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp < currentTime) {
      return false; // Token has expired
    }

    return true; 
  } catch (error) {
    console.error("Error decoding token:", (error as Error).message);
    return false;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  const isTokenValid = decodeAndValidateToken(token);

  if (!isTokenValid) {
    return <div>Your session has expired. Please log in again.</div>;
  }

  const params = await searchParams;

  return (
    <div className="p-8">
      <LogsTable searchParams={params} />
    </div>
  );
}
