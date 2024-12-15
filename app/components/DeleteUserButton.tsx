"use client";

import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
}

interface DeleteUserButtonProps {
  user: User;
  empresaId: string;
}

export default function DeleteUserButton({
  user,
  empresaId,
}: DeleteUserButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/empresa/users/${empresaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        setError(`Error deleting user: ${errorMessage}`);
        return;
      }

      // Close dialog and save success message to localStorage
      setShowDialog(false);
      localStorage.setItem(
        "snackbarMessage",
        "Usuario eliminado con éxito."
      );

      // Refresh the server component
      router.refresh();
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowDialog(true)}
        className="text-red-600 hover:text-red-800"
      >
        <FaTrashAlt />
      </button>

      {/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center text-left">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              Confirmar Eliminación
            </h2>
            <p className="mb-4 text-gray-600">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <span className="font-bold text-black">
                &quot;{user.name}&quot;
              </span>
              ?
            </p>
            <p className="mb-4 text-red-600">
              Esta acción es permanente y no se puede deshacer.
            </p>

            {error && (
              <div className="mb-4 text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
