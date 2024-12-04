import { cookies } from "next/headers";
import { Empresa } from "../models/empresa.model";

interface FetchEmpresasParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  nombre?: string;
}

async function fetchEmpresas(params: FetchEmpresasParams): Promise<{
  empresas: Empresa[];
  totalPages: number;
  totalItems: number;
}> {
  const { page, pageSize, sortBy, sortDirection, nombre } = params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortDirection,
    ...(nombre && { nombre }),
  });

  const response = await fetch(
    `http://localhost:7001/api/EmpresaManager?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || "Failed to fetch empresas";
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }

  const data = await response.json();

  return {
    empresas: data.empresas,
    totalPages: data.totalPages,
    totalItems: data.totalItems,
  };
}

export default fetchEmpresas;
