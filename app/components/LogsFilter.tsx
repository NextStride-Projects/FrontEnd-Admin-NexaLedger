"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogsFilters() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [empresaId, setEmpresaId] = useState("");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (userId) params.set("userId", userId);
    if (empresaId) params.set("empresaId", empresaId);

    router.push(`/dashboard/registros?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        placeholder="Buscar por ID Usuario"
        className="border p-2 rounded w-1/2"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buscar por ID Empresa"
        className="border p-2 rounded w-1/2"
        value={empresaId}
        onChange={(e) => setEmpresaId(e.target.value)}
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
