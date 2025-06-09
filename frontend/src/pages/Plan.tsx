// frontend/src/pages/Plan.tsx

import React, { useState, useEffect } from 'react';
import type { Plan as PlanType, CrearPlanPayload } from '../services/planService';
import { getAllPlanes, createPlan } from '../services/planService';
import SidebarAdmin from '../components/AdminSidebar';

const Plan: React.FC = () => {
  // Estado para la lista de planes
  const [planes, setPlanes] = useState<PlanType[]>([]);
  // Estados para el formulario
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');          // lo guardamos como string en el input
  const [duracionDias, setDuracionDias] = useState<string>(''); // idem

  // Cargar todos los planes al montarse
  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const data = await getAllPlanes();
      setPlanes(data);
    } catch (err) {
      console.error('Error obteniendo planes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!nombre || !precio || !duracionDias) {
      alert('Debe completar Nombre, Precio y Duración.');
      return;
    }

    const payload: CrearPlanPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio),
      duracion_dias: parseInt(duracionDias, 10),
    };

    try {
      await createPlan(payload);
      // Una vez creado, recargamos la lista y limpiamos el formulario
      fetchPlanes();
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setDuracionDias('');
    } catch (error: unknown) {
      // Si el backend devolvió 400 con mensaje:
      if (error && typeof error === 'object' && 'response' in error &&
          error.response && typeof error.response === 'object' && 
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert('Ocurrió un error al crear el plan.');
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      <SidebarAdmin />

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Crear plan</h1>

          {/* Formulario para crear un nuevo plan */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del plan */}
              <div>
                <label htmlFor="nombre" className="block text-gray-700 font-medium mb-1">
                  Nombre del plan
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ej: Plan Mensual Básico"
                />
              </div>

              {/* Duración */}
              <div>
                <label htmlFor="duracionDias" className="block text-gray-700 font-medium mb-1">
                  Duración (días)
                </label>
                <input
                  id="duracionDias"
                  type="number"
                  min="1"
                  value={duracionDias}
                  onChange={(e) => setDuracionDias(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ej: 30"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-gray-700 font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="Descripción del plan"
                ></textarea>
              </div>

              {/* Precio */}
              <div>
                <label htmlFor="precio" className="block text-gray-700 font-medium mb-1">
                  Precio
                </label>
                <input
                  id="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ej: 30000"
                />
              </div>

              {/* Botones Save / Cancel */}
              <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                <button
                  type="submit"
                  className="bg-yellow-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Limpiar formulario
                    setNombre('');
                    setDescripcion('');
                    setPrecio('');
                    setDuracionDias('');
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {/* Tabla donde se muestran todos los planes */}
          <div className="bg-purple-800 text-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-white font-medium">
                Show Entities
                <select className="ml-2 bg-white text-gray-800 rounded px-2 py-1">
                  <option>10</option>
                  <option>20</option>
                </select>
              </label>
              <div className="relative flex-1 max-w-xs ml-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {/* Ícono de búsqueda */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012 19.5a7.5 7.5 0 004.65-15.35z"
                  />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-2 px-3">Plan Name</th>
                    <th className="py-2 px-3">Validity (días)</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Descripción</th>
                    <th className="py-2 px-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.map((plan) => (
                    <tr
                      key={plan.id_membresia}
                      className="border-b border-gray-700 last:border-b-0 hover:bg-purple-700"
                    >
                      <td className="py-2 px-3">{plan.nombre}</td>
                      <td className="py-2 px-3">{plan.duracion_dias}</td>
                      <td className="py-2 px-3">${parseFloat(plan.precio).toFixed(0)}</td>
                      <td className="py-2 px-3">{plan.descripcion}</td>
                      <td className="py-2 px-3">
                        <button className="bg-white text-purple-800 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación simple */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <button className="px-4 py-2 bg-white text-purple-800 rounded-md hover:bg-gray-100">
                Anterior
              </button>
              <button className="px-4 py-2 bg-white text-purple-800 rounded-md hover:bg-gray-100">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plan;
