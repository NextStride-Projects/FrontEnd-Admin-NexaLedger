"user server";

import DeleteUserButton from "./DeleteUserButton";
import { cookies } from "next/headers";
import Snackbar from "./Snackbar";

interface User {
  id: string;
  name: string;
  email: string;
  empresaId: number;
  latestLogin: string | null;
}

export default async function EmpresaUsers({
  empresaId,
}: {
  empresaId: string;
}) {
  try {
    const users = await fetchUsers(empresaId);

    return (
      <div className="rounded-lg overflow-auto h-[500px]">
        {users.length > 0 ? (
          <table className="w-full bg-white">
            <thead className="bg-green-800 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-medium">ID</th>
                <th className="px-4 py-2 text-left font-medium">Nombre</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">
                  Último Inicio de Sesión
                </th>
                <th className="px-4 py-2 text-left font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-green-100 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-gray-900">{user.id}</td>
                  <td className="px-4 py-2 text-gray-900">{user.name}</td>
                  <td className="px-4 py-2 text-gray-900">{user.email}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {user.latestLogin
                      ? new Date(user.latestLogin).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <DeleteUserButton user={user} empresaId={empresaId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No se encontraron usuarios.</p>
        )}
        <Snackbar />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold text-red-600">Error</h3>
        <p>{(error as Error).message}</p>
      </div>
    );
  }
}

async function fetchUsers(empresaId: string): Promise<User[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    const usersResponse = await fetch(
      `http://localhost:7001/api/UsuarioManager/empresa/${empresaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        next: { tags: [`empresa-users-${empresaId}`] },
      }
    );

    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
    }

    const users = await usersResponse.json();

    const userLogsPromises = users.map(async (user: { id: string }) => {
      try {
        const logsResponse = await fetch(
          `http://localhost:7002/api/Log?userId=${user.id}&action=UserLoginSuccess&sortBy=timestamp&sortDirection=desc&pageSize=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const logs = await logsResponse.json();
        const latestLogTimestamp = logs.logs?.[0]?.timestamp || null;

        return { ...user, latestLogin: latestLogTimestamp };
      } catch (error) {
        console.error(`Error fetching logs for user ${user.id}:`, error);
        return {
          ...user,
          latestLogin: null,
          logError: "Failed to fetch logs.",
        };
      }
    });

    const usersWithLogs = await Promise.all(userLogsPromises);
    return usersWithLogs;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Unexpected error occurred while fetching users.");
  }
}
