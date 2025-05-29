// src/pages/Teachers.tsx
import React from "react";
import { Search } from "lucide-react";

const Teachers: React.FC = () => (
  <div className="flex-1 flex flex-col w-full">
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-[#59427D] text-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Profesores</h2>
        <button className="bg-white text-primary px-4 py-2 rounded-md mb-6 hover:bg-gray-100">
          Agregar profesor
        </button>
        {/* Aquí el mismo contenido de la tabla de profesores */}
      </div>
      <div className="p-8 pt-0">
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h3 className="text-gray-700 text-sm">Miembros en el gimnasio</h3>
          <p className="text-4xl font-bold text-gray-900">12</p>
        </div>
      </div>
    </div>
  </div>
);

export default Teachers;
