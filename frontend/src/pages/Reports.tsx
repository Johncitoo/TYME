// src/pages/Reports.tsx
import React from "react";

const Reports: React.FC = () => (
  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-[#F0E68C] p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Reportes</h2>
      <p>Contenido para la sección de Reportes.</p>
      <div className="mt-4 p-4 border border-dashed border-gray-400 h-full flex items-center justify-center text-gray-600">
        Este es un bloque de contenido que se estira para ocupar el espacio restante.
      </div>
    </div>
  </div>
);

export default Reports;
