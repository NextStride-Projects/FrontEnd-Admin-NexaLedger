"use client";

import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  empresaId: number;
  latestLogin: string | null;
}

interface EmpresaUsersProps {
  empresaId: string;
}

export default function EmpresaUsers({ empresaId }: EmpresaUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/empresa/users/${empresaId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          setError(`Error fetching users: ${errorMessage}`);
          return;
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Error fetching users. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [empresaId]);

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/empresa/users/${empresaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUser.id }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        setError(`Error deleting user: ${errorMessage}`);
        return;
      }

      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setShowDialog(false);
      setSelectedUser(null);
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-gray-700">Cargando usuarios...</p>;
  }

  if (error) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold text-red-600">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg overflow-auto h-[500px] flex items-start justify-center">
        {users.length > 0 ? (
          <table className="w-full bg-white">
            <thead className="bg-green-800 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-medium">ID</th>
                <th className="px-4 py-2 text-left font-medium">Nombre</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">
                  Último Inicio de Sesión
                </th>
                <th className="px-4 py-2 text-left font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={`hover:bg-green-100 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-gray-900">{user.id}</td>
                  <td className="px-4 py-2 text-gray-900">{user.name}</td>
                  <td className="px-4 py-2 text-gray-900">{user.email}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {user.latestLogin
                      ? new Date(user.latestLogin).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDialog(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No se encontraron usuarios.</p>
        )}
      </div>

      {showDialog && selectedUser && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Dialog Container */}
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-[400px] z-50 transform transition-transform duration-300 ease-in-out scale-100"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              Confirmar Eliminación
            </h2>
            <p className="mb-6 text-gray-600">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <span className="font-bold text-black">
                &quot;{selectedUser.name}&quot;
              </span>
              ? 
            </p>
            <p className="mb-6 text-red-600">
            Esta acción es permanente y no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition duration-150"
              >
                Eliminar
              </button>
            </div>
          </div>
          {/* Add keyframe animation */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
