"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";

const fetchClientIp = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const { ip } = await response.json();
    return ip;
  } catch (error) {
    console.error("Error fetching client IP:", error);
    return "Unknown";
  }
};

export default function LoginPage() {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to decode and validate the token
  const decodeAndValidateToken = (token: string): boolean => {
    try {
      const decoded = jwt.decode(token) as JwtPayload;

      if (!decoded || !decoded.exp) {
        throw new Error("Invalid token structure");
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", (error as Error).message);
      return false;
    }
  };

  useEffect(() => {
    console.log("All cookies:", document.cookie);
    const token = Cookies.get("token");
    console.log("Token from js-cookie:", token);
  
    if (token && decodeAndValidateToken(token)) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const ip = await fetchClientIp();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey, ip }),
      });

      if (res.ok) {
        router.push("/dashboard/empresas");
      } else {
        const data = await res.json();
        const errorMessage =
          typeof data.message === "string"
            ? data.message
            : "Error en el inicio de sesión.";
        setError(errorMessage);
      }
    } catch {
      setError("Algo salió mal. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/login-bg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10">
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
          NexaLedger
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Plataforma de Administración Segura
        </p>

        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded p-4 mb-4">
          <p className="text-sm font-medium text-center">
            Acceso exclusivo para administradores autorizados. Intentos no
            autorizados serán rastreados.
          </p>
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-green-800 animate-pulse"></div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="adminKey"
              className="block text-sm font-medium text-gray-700"
            >
              Clave de Administrador
            </label>
            <input
              type="password"
              id="adminKey"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Introduce tu clave de administrador"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-800 focus:border-green-800"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
