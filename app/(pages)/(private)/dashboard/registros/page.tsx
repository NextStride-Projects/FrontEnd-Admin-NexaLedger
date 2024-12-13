import LogsTable from "@/app/components/LogsTable";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="p-8">
      <LogsTable searchParams={params} />
    </div>
  );
}
