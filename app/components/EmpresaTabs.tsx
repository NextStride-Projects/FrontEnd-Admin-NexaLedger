"use client";

import { useState } from "react";

interface EmpresaTabsProps {
  empresaId: string;
}

export default function EmpresaTabs({ empresaId }: EmpresaTabsProps) {
  const [activeTab, setActiveTab] = useState("detalles");

  console.log(empresaId);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="relative flex items-center gap-4 mb-4">
        {/* Header Bottom Border with Animation */}
        <div className="absolute bottom-0 left-0 right-0 border-b border-green-800 z-0 animate-border-appear"></div>

        <button
          onClick={() => handleTabClick("detalles")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "detalles"
              ? "border-t border-l border-r border-green-800 bg-white rounded-t text-black -mb-[1px]"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Detalles de la Empresa
        </button>
        <button
          onClick={() => handleTabClick("usuarios")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "usuarios"
              ? "border-t border-l border-r border-green-800 bg-white rounded-t text-black -mb-[1px]"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Usuarios de la Empresa
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg overflow-auto h-[500px] flex items-start justify-center bg-gray-50 p-4">
        {activeTab === "detalles" && (
          <div className="w-full">
            <h3 className="text-lg font-semibold">Detalles de la Empresa</h3>
            <p className="text-gray-700">
              Aquí puedes mostrar los detalles de la empresa seleccionada.
            </p>
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="w-full">
            <h3 className="text-lg font-semibold">Usuarios de la Empresa</h3>
            <p className="text-gray-700">
              Aquí puedes listar los usuarios asociados a esta empresa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
