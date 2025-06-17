// frontend/src/pages/CreateRoutine.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/AdminSidebar";
import { createRoutine } from "../services/routine.service"; // Este servicio necesita ser creado o adaptado
import axios from "axios";
import { Check } from "lucide-react";

// Actualiza la interfaz para los datos de un formulario de rutina
interface RoutineFormData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string; // Formato YYYY-MM-DD
}

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();

  // Estado del formulario completo de "Crear Rutina"
  const [form, setForm] = useState<RoutineFormData>({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
  });

  // Mensajes de error / éxito
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Handler genérico para inputs y textareas del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Al presionar "Guardar" en el formulario principal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación mínima (todos los campos obligatorios)
    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.fecha_inicio.trim()
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);

    // Preparamos el payload con el formato que espera el backend
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      fecha_inicio: form.fecha_inicio, // en formato "YYYY-MM-DD"
    };

    try {
      // Asumiendo que la función createRoutine existe en services/routine.service
      await createRoutine(payload);
      alert("Rutina creada correctamente.");
      // Redirigimos a la lista de rutinas
      navigate("/admin/rutinas"); // Ajusta esta ruta si tu lista de rutinas es diferente
    } catch (err: unknown) {
      console.error(err);
      // Si viene un mensaje del backend:
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error al crear la rutina.");
      }
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Barra lateral reusable */}
      <SidebarAdmin />

      {/* Área principal */}
      <main className="flex-1 overflow-y-auto bg-[#f4f4f6] p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-teal-500 mb-6">
            Crear Nueva Rutina
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Nombre de la rutina */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nombre de la Rutina *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-y"
                ></textarea>
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <span className="text-xs text-gray-500">
                  Formato: AAAA-MM-DD
                </span>
              </div>
            </div>

            {/* Botones "Guardar" y "Cancelar" */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md font-semibold transition disabled:opacity-50"
              >
                <Check size={16} />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/rutinas")} // Ajusta esta ruta
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRoutine;