"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmpresaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nombreParam = searchParams.get("nombre") || "";
  const [nombre, setNombre] = useState(nombreParam);

  useEffect(() => {
    setNombre(nombreParam);
  }, [nombreParam]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (nombre) {
      params.set("nombre", nombre);
    } else {
      params.delete("nombre");
    }

    // Reset to first page when filters change
    params.set("page", "1");

    router.push(`/dashboard/empresas?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        placeholder="Buscar por Nombre"
        className="border p-2 rounded w-full"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button
        onClick={applyFilters}
        className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Buscar
      </button>
    </div>
  );
}
