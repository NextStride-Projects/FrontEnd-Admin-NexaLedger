"use client";

import { useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

export default function AppBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = (path: string, queries: Record<string, string | number>) => {
    setIsSidebarOpen(false); // Close sidebar on navigation

    // Convert number values to strings
    const queryString = new URLSearchParams(
      Object.entries(queries).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    // Push the new path with query parameters
    router.push(`${path}?${queryString}`);
  };

  return (
    <>
      {/* AppBar */}
      <header className="bg-green-800 text-white shadow-md">
        <div className="flex justify-between items-center px-4 py-2">
          {/* Hamburger Menu */}
          <div className="flex flex-row gap-10">
            <button
              className="text-2xl focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Toggle Menu"
            >
              <FiMenu />
            </button>

            {/* Title */}
            <h1 className="text-2xl font-semibold">NexaLedger Admin Board</h1>
          </div>

          {/* Logout Button */}
          <LogoutButton>
            <FiLogOut className="text-2xl" title="Logout" />
          </LogoutButton>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar} // Close sidebar when clicking outside
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-6">Menú</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() =>
                  navigate("/dashboard/empresas", {
                    page: 1,
                    pageSize: 10,
                    sortBy: "id",
                    sortDirection: "asc",
                  })
                }
                className="w-full text-left px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Empresas
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  navigate("/dashboard/registros", {
                    page: 1,
                    pageSize: 10,
                    sortBy: "timestamp",
                    sortDirection: "desc",
                  })
                }
                className="w-full text-left px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Registros
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
