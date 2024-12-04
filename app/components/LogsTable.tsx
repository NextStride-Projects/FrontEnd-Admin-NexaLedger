import { cookies } from "next/headers";
import Link from "next/link";
import { Log } from "../models/log.model";
import LogsFilters from "./LogsFilter";
import PageSizeSelector from "./PageSizeSelector";
import SortableHeader from "./SortTableHeader";

interface LogsTableProps {
  searchParams: Record<string, string | undefined>;
}

export default async function LogsTable({ searchParams }: LogsTableProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = parseInt(searchParams.pageSize || "10", 10);
  const sortBy = searchParams.sortBy || "id";
  const sortDirection = searchParams.sortDirection || "asc";
  const userId = searchParams.userId || "";
  const empresaId = searchParams.empresaId || "";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  // Fetch logs with the given query parameters
  const { logs, totalPages, totalItems } = await fetchLogs({
    page,
    pageSize,
    sortBy,
    sortDirection,
    userId,
    empresaId,
    token,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-black mb-6">Registros</h2>

      {/* Filters */}
      <LogsFilters />

      <PageSizeSelector />

      {/* Table */}
      <div className="rounded-lg overflow-auto h-[500px] flex items-start justify-center">
        {logs.length > 0 ? (
          <table className="w-full bg-white">
            <thead className="bg-green-800 text-white">
              <tr>
                <th>
                  <SortableHeader
                    title="ID"
                    sortByField="id"
                    currentSortBy={sortBy}
                    currentSortDirection={sortDirection}
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-2 text-left font-medium">Acción</th>
                <th className="px-4 py-2 text-left font-medium">ID Usuario</th>
                <th className="px-4 py-2 text-left font-medium">ID Empresa</th>
                <th className="px-4 py-2 text-left font-medium">
                  ID Empresa Accedida
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  ID Usuario Accedido
                </th>
                <th>
                  <SortableHeader
                    title="Fecha y Hora"
                    sortByField="timestamp"
                    currentSortBy={sortBy}
                    currentSortDirection={sortDirection}
                    searchParams={searchParams}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`hover:bg-green-100 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-gray-900">{log.id}</td>
                  <td className="px-4 py-2 text-gray-900">{log.action}</td>
                  <td className="px-4 py-2 text-gray-900">{log.userId}</td>
                  <td className="px-4 py-2 text-gray-900">{log.empresaId}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {log.accessedEmpresaId ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    {log.accessedUsuarioId ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay registros disponibles.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Link
          href={{
            pathname: "/dashboard/registros",
            query: {
              ...searchParams,
              page: page - 1,
            },
          }}
          className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <span>
          Página {page} de {totalPages} (Total: {totalItems} registros)
        </span>
        <Link
          href={{
            pathname: "/dashboard/registros",
            query: {
              ...searchParams,
              page: page + 1,
            },
          }}
          className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${
            page === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}

// Fetch logs with query parameters
// Fetch logs with query parameters
async function fetchLogs({
  page,
  pageSize,
  sortBy,
  sortDirection,
  userId,
  empresaId,
  token,
}: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  userId?: string;
  empresaId?: string;
  token: string;
}): Promise<{
  logs: Log[];
  totalPages: number;
  totalItems: number;
}> {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortDirection,
    ...(userId && { userId }),
    ...(empresaId && { empresaId }),
  });

  const response = await fetch(
    `http://localhost:7002/api/Log?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // Get error message from the response body
    const errorData = await response.json();

    const errorMessage = errorData.error || "Failed to fetch logs";

    // Throw an error with the status code and message
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }

  const responseData = await response.json();

  return responseData;
}
