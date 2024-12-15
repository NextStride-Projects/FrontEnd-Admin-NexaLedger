"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface StatusEmpresaButtonProps {
  empresaId: string;
  empresaName: string;
  empresaStatus: string; // Either "Activo" or "Inactivo"
}

export function StatusEmpresaButton({
  empresaId,
  empresaName,
  empresaStatus,
}: StatusEmpresaButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [motive, setMotive] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!motive.trim()) {
      setError("Por favor, ingresa un motivo para continuar.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiEndpoint =
        empresaStatus === "Activo"
          ? `/api/empresa/desactivar/${empresaId}`
          : `/api/empresa/activar/${empresaId}`;

      const res = await fetch(apiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motive }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        setError(
          `Error al ${empresaStatus === "Activo" ? "desactivar" : "activar"} la empresa: ${errorMessage}`
        );
        return;
      }

      setShowModal(false);
      router.refresh();
    } catch (err) {
      setError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`px-4 py-2 ${
          empresaStatus === "Activo" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        } text-white rounded`}
      >
        {empresaStatus === "Activo" ? "Desactivar Empresa" : "Activar Empresa"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[400px]">
            <h2
              className={`text-xl font-semibold mb-4 ${
                empresaStatus === "Activo" ? "text-red-600" : "text-green-600"
              }`}
            >
              {empresaStatus === "Activo" ? "Desactivar Empresa" : "Activar Empresa"}
            </h2>
            <p className="mb-4 text-gray-600">
              ¿Estás seguro de que deseas{" "}
              {empresaStatus === "Activo" ? "desactivar" : "activar"} la empresa{" "}
              <span className="font-bold text-black">
                &quot;{empresaName}&quot;
              </span>
              ?
            </p>
            <div>
              <label
                htmlFor="motive"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Motivo:
              </label>
              <div className="relative">
                <textarea
                  id="motive"
                  rows={4}
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  className="peer w-full border border-gray-300 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  placeholder=" "
                  disabled={isSubmitting}
                ></textarea>
                {!motive && <span className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-green-600">
                  Escribe el motivo aquí...
                </span>}
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 ${
                  empresaStatus === "Activo"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? empresaStatus === "Activo"
                    ? "Desactivando..."
                    : "Activando..."
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
