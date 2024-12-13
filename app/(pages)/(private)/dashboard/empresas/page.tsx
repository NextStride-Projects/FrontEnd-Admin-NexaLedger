import EmpresasTable from "@/app/components/EmpresaTable";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="p-8">
      <EmpresasTable searchParams={params} />
    </div>
  );
}

