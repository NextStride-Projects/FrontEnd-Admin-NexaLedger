import React from "react";
import { Empresa } from "@/app/models/empresa.model";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserTie, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

interface EmpresaDetailsProps {
  empresa: Empresa;
}

export default function EmpresaDetails({ empresa }: EmpresaDetailsProps) {
  if (!empresa) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-700">Sin datos</h3>
        <p>No se encontraron detalles de la empresa.</p>
      </div>
    );
  }

  let features: string[] = [];

  try {
    features =
      typeof empresa.features === "string"
        ? JSON.parse(empresa.features)
        : empresa.features;
  } catch (error) {
    console.error("Error parsing features:", error);
  }

  return (
    <div className="p-6 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaUserTie className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Nombre</p>
            <p className="text-base text-gray-800">{empresa.fullName}</p>
          </div>
        </div>

        {/* Alias */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaUserTie className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Alias</p>
            <p className="text-base text-gray-800">{empresa.alias}</p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaPhoneAlt className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Teléfono</p>
            <p className="text-base text-gray-800">{empresa.phone}</p>
          </div>
        </div>

        {/* Email */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaEnvelope className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Email</p>
            <p className="text-base text-gray-800">{empresa.email}</p>
          </div>
        </div>

        {/* Categoría */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <MdCategory className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Categoría</p>
            <p className="text-base text-gray-800">{empresa.category}</p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaMapMarkerAlt className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Ubicación</p>
            <p className="text-base text-gray-800">{empresa.location}</p>
          </div>
        </div>

        {/* Persona Responsable */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaUserTie className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Persona Responsable</p>
            <p className="text-base text-gray-800">{empresa.responsiblePerson}</p>
          </div>
        </div>

        {/* Email Responsable */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <FaEnvelope className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Email Responsable</p>
            <p className="text-base text-gray-800">{empresa.responsibleEmail}</p>
          </div>
        </div>

        {/* Estado Activo */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          {empresa.active ? (
            <FaCheckCircle className="text-green-800 text-2xl" />
          ) : (
            <FaTimesCircle className="text-red-800 text-2xl" />
          )}
          <div>
            <p className="text-sm font-bold text-gray-600">Estado Activo</p>
            <p className="text-base text-gray-800">{empresa.active ? "Sí" : "No"}</p>
          </div>
        </div>

        {/* Descripción */}
        <div className="p-4 bg-white shadow rounded-md flex items-center gap-4">
          <MdCategory className="text-green-800 text-2xl" />
          <div>
            <p className="text-sm font-bold text-gray-600">Descripción</p>
            <p className="text-base text-gray-800">{empresa.description || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="mt-6">
        <p className="text-lg font-bold text-gray-700 mb-2">Características</p>
        {features.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className="p-3 bg-white shadow rounded-md text-base text-gray-800"
              >
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-800">N/A</p>
        )}
      </div>
    </div>
  );
}
