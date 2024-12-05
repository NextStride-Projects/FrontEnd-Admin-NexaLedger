import { cookies } from "next/headers";
import fetchEmpresas from "../utils/fetchEmpresas";
import PageSizeSelector from "./PageSizeSelector";
import EmpresaFilters from "./EmpresaFilters";
import SortableHeader from "./SortTableHeader";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface EmpresasTableProps {
  searchParams: Record<string, string | undefined>;
}

export default async function EmpresasTable({
  searchParams,
}: EmpresasTableProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = parseInt(searchParams.pageSize || "10", 10);
  const sortBy = searchParams.sortBy || "id";
  const sortDirection = searchParams.sortDirection || "asc";
  const nombre = searchParams.nombre || "";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  try {
    const { empresas, totalPages, totalItems } = await fetchEmpresas({
      page,
      pageSize,
      sortBy,
      sortDirection,
      nombre,
    });

    return (
      <div>
        <h2 className="text-2xl font-semibold text-black mb-6">Empresas</h2>

        {/* Filters */}
        <EmpresaFilters />

        {/* Page Size Selector */}
        <PageSizeSelector />

        <div className="rounded-lg overflow-auto h-[500px] flex items-start justify-center">
          {empresas.length > 0 ? (
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
                  <th>
                    <SortableHeader
                      title="Nombre"
                      sortByField="nombre"
                      currentSortBy={sortBy}
                      currentSortDirection={sortDirection}
                      searchParams={searchParams}
                    />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Dirección</th>
                  <th className="px-4 py-2 text-left font-medium">Teléfono</th>
                  <th className="px-4 py-2 text-left font-medium">Email</th>
                  <th className="px-4 py-2 text-left font-medium">{" "}</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa, index) => (
                  <tr
                    key={empresa.id}
                    className={`hover:bg-green-100 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-900">{empresa.id}</td>
                    <td className="px-4 py-2 text-gray-900">
                      {empresa.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {empresa.direccion}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {empresa.telefono}
                    </td>
                    <td className="px-4 py-2 text-gray-900">{empresa.email}</td>
                    <td className="px-4 py-2 text-gray-900 text-right">
                    <Link href={`/dashboard/empresas/${empresa.id}`} className="text-green-800 hover:text-green-600">
                      <FaArrowRight className="inline-block" />
                    </Link>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay empresas disponibles.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-300 rounded flex justify-between items-center pt-4">
          <Link
            href={{
              pathname: "/dashboard/empresas",
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
            Página {page} de {totalPages} (Total: {totalItems} empresas)
          </span>
          <Link
            href={{
              pathname: "/dashboard/empresas",
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
  } catch (error) {
    console.error("Failed to fetch empresas:", error);
    return (
      <p className="text-red-500">
        Failed to load empresas. Please try again later.
      </p>
    );
  }
}
