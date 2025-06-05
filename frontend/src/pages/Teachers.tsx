// frontend/src/pages/Teachers.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/AdminSidebar";
import { Search } from "lucide-react";
import { getAllEntrenadores } from "../services/entrenador.service";
import type { EntrenadorBackend } from "../services/entrenador.service";
const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [listaEntrenadores, setListaEntrenadores] = useState<EntrenadorBackend[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllEntrenadores()
      .then((data) => {
        setListaEntrenadores(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la lista de entrenadores.");
        setCargando(false);
      });
  }, []);

  const obtenerNombreCompleto = (u: EntrenadorBackend["usuario"]) => {
    return [
      u.primer_nombre,
      u.segundo_nombre,
      u.primer_apellido,
      u.segundo_apellido,
    ]
      .filter((parte) => parte && parte.trim().length > 0)
      .join(" ");
  };

  const formatearRut = (u: EntrenadorBackend["usuario"]) => {
    return `${u.cuerpo_rut}-${u.dv_rut}`;
  };

  if (cargando) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-600">Cargando entrenadores...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Barra lateral de administrador */}
      <SidebarAdmin />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto bg-[#f4f4f6]">
        {/* Header de sección */}
        <div className="flex justify-between items-center mb-6 px-8 pt-8">
         <h1 className="text-3xl font-bold text-teal-500">Profesores</h1>
         <button
           className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-gray-200 transition"
           onClick={() => navigate("/admin/profesores/crear")}
         >
           Agregar profesor
         </button>
        </div>

        <div className="mx-8 mb-8">
          <div className="bg-purple-600 bg-opacity-20 rounded-2xl p-6">
            {/* Fila superior con “Show Entities” y “Search” */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">Show Entities</label>
                <select className="bg-white px-2 py-1 rounded-md border border-gray-300">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-md transition">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Tabla de entrenadores */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">RUT</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Contacto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Correo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listaEntrenadores.map((ent) => {
                    const u = ent.usuario;
                    const nombreCompleto = obtenerNombreCompleto(u);
                    const rut = formatearRut(u);
                    return (
                      <tr
                        key={ent.id_entrenador}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                          {nombreCompleto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {rut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {u.telefono}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {u.correo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm transition">
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación simple */}
            <div className="flex justify-end mt-6 space-x-4">
              <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">
                Anterior
              </button>
              <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teachers;

