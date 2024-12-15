import EmpresaDetails from "./EmpresaDetails";
import { Empresa } from "../models/empresa.model";
import EmpresaUsers from "./EmpresaUsers";

interface EmpresaTabsProps {
  empresa: Empresa;
  tab?: string;
}

export default function EmpresaTabs({
  empresa,
  tab,
}: EmpresaTabsProps) {
  const activeTab = tab || "detalles";

  return (
    <div>
      <div className="relative flex items-center gap-4 mb-4">
        <div className="absolute bottom-0 left-0 right-0 border-b border-green-800 z-0"></div>

        <a
          href={`?tab=detalles`}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "detalles"
              ? "border border-green-800 border-b-white bg-white rounded-t text-black"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Detalles de la Empresa
        </a>
        <a
          href={`?tab=usuarios`}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "usuarios"
              ? "border border-green-800 border-b-white bg-white rounded-t text-black"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Usuarios de la Empresa
        </a>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg overflow-auto h-[680px] flex items-start justify-center p-4">
        {activeTab === "detalles" && (
          <div className="w-full">
            <EmpresaDetails empresa={empresa} />
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="w-full">
            <EmpresaUsers empresaId={String(empresa.id)} />
          </div>
        )}
      </div>
    </div>
  );
}
