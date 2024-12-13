import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cookie from "cookie";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ empresaId: string }> }
): Promise<NextResponse> {
  const { empresaId } = await params;

  try {
    const cookiesHeader = req.headers.get("cookie");
    const cookies = cookiesHeader ? cookie.parse(cookiesHeader) : {};
    const token = cookies.token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token not found." },
        { status: 401 }
      );
    }

    let users: Array<{ id: string }> = [];
    try {
      const usersResponse = await axios.get(
        `http://localhost:7001/api/UsuarioManager/empresa/${empresaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      users = usersResponse.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching users:", axiosError.message);
      return NextResponse.json(
        {
          message: `Failed to fetch users for empresaId: ${empresaId}. ${axiosError.response?.data || "Unknown error."}`,
        },
        { status: axiosError.response?.status || 500 }
      );
    }

    // Fetch logs for each user to get the latest login timestamp
    const userLogsPromises = users.map(async (user: { id: string }) => {
      try {
        const logsResponse = await axios.get(
          `http://localhost:7002/api/Log?userId=${user.id}&action=UserLoginSuccess&sortBy=timestamp&sortDirection=desc&pageSize=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const logs = logsResponse.data.logs || [];
        const latestLogTimestamp = logs.length > 0 ? logs[0].timestamp : null;

        return { ...user, latestLogin: latestLogTimestamp };
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`Error fetching logs for user ${user.id}:`, axiosError.message);
        return { ...user, latestLogin: null, logError: axiosError.response?.data || "Unknown error." };
      }
    });

    const usersWithLogs = await Promise.all(userLogsPromises);

    return NextResponse.json(usersWithLogs);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}

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
