import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import EliminarClasesFuturas from "@/components/EliminarClasesFuturas"; // 👈 IMPORTANTE

interface EntrenadorOption {
  id_entrenador: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
    correo: string;
  };
}

interface ClassFormData {
  nombre: string;
  descripcion: string;
  fecha_clase: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  id_entrenador: number | "";
}

type Props = {
  /** Si se pasa el id, el campo entrenador se oculta y se usa ese valor. Si no, muestra el select */
  idEntrenador?: number;
  /** Callback cuando se guarda con éxito (ejemplo: navegación, recarga, etc) */
  onSuccess?: () => void;
};

const ClassForm: React.FC<Props> = ({ idEntrenador, onSuccess }) => {
  const [form, setForm] = useState<ClassFormData>({
    nombre: "",
    descripcion: "",
    fecha_clase: "",
    hora_inicio: "",
    hora_fin: "",
    cupo_maximo: 1,
    id_entrenador: idEntrenador ?? "",
  });

  const [entrenadores, setEntrenadores] = useState<EntrenadorOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cargar entrenadores solo si el idEntrenador NO está seteado (modo admin)
  useEffect(() => {
    if (typeof idEntrenador === "number") {
      setForm((prev) => ({ ...prev, id_entrenador: idEntrenador }));
      return;
    }
    const fetchEntrenadores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/entrenador/activos", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setEntrenadores(res.data);
      } catch (e) {
        setError("No se pudieron cargar los entrenadores.");
      }
    };
    fetchEntrenadores();
  }, [idEntrenador]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "id_entrenador"
          ? Number(value)
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación básica
    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.fecha_clase.trim() ||
      !form.hora_inicio.trim() ||
      !form.hora_fin.trim() ||
      !form.cupo_maximo ||
      !form.id_entrenador ||
      isNaN(Number(form.id_entrenador)) ||
      Number(form.id_entrenador) < 1
    ) {
      setError("Por favor completa todos los campos obligatorios y selecciona un entrenador válido.");
      return;
    }
    if (form.hora_inicio >= form.hora_fin) {
      setError("La hora de inicio debe ser menor que la hora de término.");
      return;
    }

    setSaving(true);

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      fecha_clase: form.fecha_clase,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      cupo_maximo: form.cupo_maximo,
      id_entrenador: form.id_entrenador,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/clase", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message;
        setError(msg);
      } else {
        setError("Ocurrió un error al crear la clase.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-teal-500 mb-6">
        Crear nueva clase
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Clase creada correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entrenador */}
          {!idEntrenador && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Entrenador a cargo *
              </label>
              <select
                name="id_entrenador"
                value={form.id_entrenador}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">Selecciona un entrenador</option>
                {entrenadores.map((ent) => (
                  <option key={ent.id_entrenador} value={ent.id_entrenador}>
                    {ent.usuario.primer_nombre} {ent.usuario.primer_apellido} ({ent.usuario.correo})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Si es modo entrenador, muestra su nombre fijo */}
          {idEntrenador && (
            <input type="hidden" name="id_entrenador" value={idEntrenador} />
          )}

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
              min={1}
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
        </div>
      </form>

      {/* Sección para eliminar clases futuras */}
      <EliminarClasesFuturas onEliminadas={onSuccess} />
    </div>
  );
};

export default ClassForm;
