import { cookies } from "next/headers";
import { Empresa } from "@/app/models/empresa.model";
import { notFound } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import EmpresaTabs from "@/app/components/EmpresaTabs";
import { StatusEmpresaButton } from "@/app/components/StatusEmpresaButton";

async function fetchEmpresa(id: string): Promise<Empresa | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(
    `http://localhost:7001/api/EmpresaManager/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function EmpresaPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const empresa = await fetchEmpresa(id);

  if (!empresa) {
    notFound();
  }

  return (
    <div className="p-8 h-[750px]">
      {/* Header with Empresa Name and Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-black">
          Empresa: {empresa.fullName}
        </h2>
        <div className="flex space-x-4">
          <StatusEmpresaButton
            empresaId={String(empresa.id)}
            empresaName={empresa.fullName}
            empresaStatus={empresa.active ? "Activo" : "Inactivo"}
          />
          <Link
            href="/dashboard/empresas"
            className="flex items-center justify-center px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700"
          >
            Volver
          </Link>
        </div>
      </div>

      <EmpresaTabs empresa={empresa} tab={tab} />
    </div>
  );
}
