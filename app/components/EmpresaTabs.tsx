"use client";

import React, { useState } from "react";
import EmpresaDetails from "./EmpresaDetails";
import EmpresaUsers from "./EmpresaUsers";
import { Empresa } from "../models/empresa.model";

interface EmpresaTabsProps {
  empresa: Empresa;
}

export default function EmpresaTabs({ empresa }: EmpresaTabsProps) {
  const [activeTab, setActiveTab] = useState("detalles");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="relative flex items-center gap-4 mb-4">
        {/* Header Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 border-b border-green-800 z-0"></div>

        <button
          onClick={() => handleTabClick("detalles")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "detalles"
              ? "border border-green-800 border-b-white bg-white rounded-t text-black"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Detalles de la Empresa
        </button>
        <button
          onClick={() => handleTabClick("usuarios")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative z-10 ${
            activeTab === "usuarios"
              ? "border border-green-800 border-b-white bg-white rounded-t text-black"
              : "border border-green-800 text-gray-500 bg-gray-100 hover:text-black rounded-t"
          }`}
        >
          Usuarios de la Empresa
        </button>
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
            <EmpresaUsers empresaId={empresa.id.toString()} />
          </div>
        )}
      </div>
    </div>
  );
}

