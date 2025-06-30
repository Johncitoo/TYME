import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/AdminSidebar";
import { Check } from "lucide-react";
import axios from "axios";

interface ClassFormData {
  nombre: string;
  descripcion: string;
  fecha_clase: string;      // YYYY-MM-DD
  hora_inicio: string;      // HH:mm
  hora_fin: string;         // HH:mm
  cupo_maximo: number;
}

const CreateClass: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ClassFormData>({
    nombre: "",
    descripcion: "",
    fecha_clase: "",
    hora_inicio: "",
    hora_fin: "",
    cupo_maximo: 1,
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.fecha_clase.trim() ||
      !form.hora_inicio.trim() ||
      !form.hora_fin.trim() ||
      form.cupo_maximo <= 0
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);

    // Arma el payload que espera el backend
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      fecha_clase: form.fecha_clase,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      cupo_maximo: form.cupo_maximo,
    };

    try {
      // createClass: tu función de servicios para crear clase
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/clase", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Clase creada correctamente.");
      navigate("/admin/clases"); // Cambia si tu ruta es diferente
    } catch (err: unknown) {
      console.error(err);
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
      <SidebarAdmin />

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

              {/* Nombre */}
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

              {/* Fecha */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fecha de la clase *
                </label>
                <input
                  type="date"
                  name="fecha_clase"
                  value={form.fecha_clase}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
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

              {/* Hora fin */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Hora de término *
                </label>
                <input
                  type="time"
                  name="hora_fin"
                  value={form.hora_fin}
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
                  min="1"
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>

            {/* Botones */}
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
                onClick={() => navigate("/admin/clases")}
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
