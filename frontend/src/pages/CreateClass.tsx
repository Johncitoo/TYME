// frontend/src/pages/CreateClass.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/AdminSidebar";
import { getAllEspecialidades } from "../services/entrenador.service"; // Reutilizado para tipos de clase
import { createClass } from "../services/class.service"; 
import axios from "axios";
import { Check } from "lucide-react";

interface Especialidad {
  id_tipo_especialidad: number;
  nombre: string;
}

// Actualiza la interfaz para los datos de un formulario de clase
interface ClassFormData {
  nombre: string;
  descripcion: string;
  hora_inicio: string; // HH:MM
  hora_termino: string; // HH:MM
  cupo_maximo: number;
  especialidades: number[]; // Array de IDs de especialidades asociadas a la clase
}

const CreateClass: React.FC = () => {
  const navigate = useNavigate();

  // Lista de especialidades (tipos de clase), obtenidas desde /entrenador/especialidades (puede ser renombrada/reutilizada)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  // Estado del formulario completo de "Crear Clase"
  const [form, setForm] = useState<ClassFormData>({
    nombre: "",
    descripcion: "",
    hora_inicio: "",
    hora_termino: "",
    cupo_maximo: 0,
    especialidades: [],
  });

  // Mensajes de error / éxito
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Al montar el componente, obtenemos:
  // - todas las especialidades (que pueden actuar como tipos de clase)
  useEffect(() => {
    getAllEspecialidades()
      .then((data: Especialidad[]) => setEspecialidades(data))
      .catch(() => setEspecialidades([]));
  }, []);

  // Handler genérico para inputs y selects del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Manejar inputs numéricos específicamente
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value), // Convertir a número
      }));
    } else if (name === "especialidades") {
      // En el select múltiple, e.target.selectedOptions
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const selectedValues = Array.from(options).map((o) => Number(o.value));
      setForm((prev) => ({
        ...prev,
        especialidades: selectedValues,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Al presionar "Guardar" en el formulario principal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación mínima (todos los campos obligatorios)
    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.hora_inicio.trim() ||
      !form.hora_termino.trim() ||
      form.cupo_maximo <= 0 || // Asegúrate de que el cupo sea al menos 1
      form.especialidades.length === 0
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);

    // Preparamos el payload con el formato que espera el backend
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      hora_inicio: form.hora_inicio,
      hora_termino: form.hora_termino,
      cupo_maximo: form.cupo_maximo,
      especialidades: form.especialidades, // array de IDs
    };

    try {
      // Asumiendo que la función createClass existe en services/class.service
      await createClass(payload);
      alert("Clase creada correctamente.");
      // Redirigimos a la lista de clases
      navigate("/admin/clases"); // Ajusta esta ruta si tu lista de clases es diferente
    } catch (err: unknown) {
      console.error(err);
      // Si viene un mensaje del backend:
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error al crear la clase.");
      }
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Barra lateral reutilizable */}
      <SidebarAdmin />

      {/* Área principal */}
      <main className="flex-1 overflow-y-auto bg-[#f4f4f6] p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-teal-500 mb-6">
            Crear nueva clase
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de la clase */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nombre de la clase *
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
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-y"
                ></textarea>
              </div>

              {/* Hora inicio */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Hora de inicio *
                </label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={form.hora_inicio}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Hora término */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Hora de término *
                </label>
                <input
                  type="time"
                  name="hora_termino"
                  value={form.hora_termino}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Cupo máximo */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Cupo máximo *
                </label>
                <input
                  type="number"
                  name="cupo_maximo"
                  value={form.cupo_maximo}
                  onChange={handleChange}
                  required
                  min="1" // Asegura un mínimo de 1 cupo
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Selección de especialidades (multiselect para tipos de clase) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Tipos de clase (Especialidades) *
                </label>
                <select
                  name="especialidades"
                  multiple
                  value={form.especialidades.map(String)} // convertir a string[] para el valor del select
                  onChange={handleChange}
                  required
                  className="w-full h-40 p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  {especialidades.map((e) => (
                    <option
                      key={e.id_tipo_especialidad}
                      value={e.id_tipo_especialidad}
                    >
                      {e.nombre}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  (Mantén presionada la tecla CTRL para seleccionar varias)
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
                onClick={() => navigate("/admin/clases")} // Ajusta esta ruta
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

export default CreateClass;