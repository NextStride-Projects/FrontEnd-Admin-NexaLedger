  import { cookies } from "next/headers";
  import { Empresa } from "@/app/models/empresa.model";
  import { notFound } from "next/navigation";
  import Link from "next/link"; // Import Link for navigation
  import EmpresaTabs from "@/app/components/EmpresaTabs";

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

  export default async function EmpresaPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    const empresa = await fetchEmpresa(id);

    if (!empresa) {
      notFound();
    }

    return (
      <div className="p-8 h-[750px]">
        {/* Header with Empresa Name and Volver Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-black">
            Empresa: {empresa.fullName}
          </h2>
          <Link
            href="/dashboard/empresas"
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Volver
          </Link>
        </div>

        {/* Tabs */}
        <EmpresaTabs empresa={empresa} />
      </div>
    );
  }
