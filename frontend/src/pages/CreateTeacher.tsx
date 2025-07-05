// frontend/src/pages/CreateTeacher.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/AdminSidebar";
import { getAllEspecialidades, createEntrenador } from "../services/entrenador.service";
import axios from "axios";
import { Pencil, Check } from "lucide-react";

interface Especialidad {
  id_tipo_especialidad: number;
  nombre: string;
}

interface ContactoEmergencia {
  id_contacto: number;
  nombre: string;
  telefono: string;
  relacion: string;
  direccion: string;
}

const generoOptions = [
  { id_tipo_genero: 1, nombre: "Masculino" },
  { id_tipo_genero: 2, nombre: "Femenino" },
  { id_tipo_genero: 3, nombre: "No binario" },
  { id_tipo_genero: 4, nombre: "Prefiero no decirlo" },
];

const sexoOptions = [
  { id_tipo_sexo: 1, nombre: "Masculino" },
  { id_tipo_sexo: 2, nombre: "Femenino" },
  { id_tipo_sexo: 3, nombre: "Otro" },
  { id_tipo_sexo: 4, nombre: "Prefiero no decirlo" },
];

const CreateTeacher: React.FC = () => {
  const navigate = useNavigate();

  // Lista de especialidades (traída desde /entrenador/especialidades)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  // Lista de contactos de emergencia (traída desde /contacto_emergencia)
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([]);

  // Estado para mostrar el form de “Crear nuevo contacto” si se selecciona “Nuevo”
  const [showNewContacto, setShowNewContacto] = useState(false);
  // Datos para crear un contacto de emergencia nuevo
  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    telefono: "",
    relacion: "",
    direccion: "",
  });

  // Estado del formulario completo de “Crear Entrenador”
  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    telefono: "",
    cuerpo_rut: "",
    dv_rut: "",
    direccion: "",
    fecha_nacimiento: "",
    id_tipo_genero: "",
    id_tipo_sexo: "",
    id_contacto_emergencia: "",
    especialidades: [] as number[],
  });

  // Mensajes de error / éxito
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Al montar el componente, traemos:
  //  - todas las especialidades
  //  - todos los contactos de emergencia
  useEffect(() => {
    getAllEspecialidades()
      .then((data: Especialidad[]) => setEspecialidades(data))
      .catch(() => setEspecialidades([]));

    axios
      .get<ContactoEmergencia[]>("http://localhost:3000/contacto_emergencia")
      .then((res) => setContactos(res.data))
      .catch(() => setContactos([]));
  }, []);

  // Handler genérico para inputs y selects del form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // especialidades requiere cast a array de números cuando cambie
    if (name === "especialidades") {
      // En el select múltiple, e.target.selectedOptions
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const selectedValues = Array.from(options).map((o) =>
        Number(o.value)
      );
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

  // Handler para mostrar/ocultar creación de nuevo contacto
  const handleContactoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "nuevo") {
      setShowNewContacto(true);
      setForm((prev) => ({ ...prev, id_contacto_emergencia: "" }));
    } else {
      setShowNewContacto(false);
      setForm((prev) => ({ ...prev, id_contacto_emergencia: value }));
    }
  };

  // Handler para inputs del sub-form de “nuevo contacto”
  const handleNuevoContactoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNuevoContacto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cuando el usuario presiona “Agregar contacto” en el subform
  const handleAgregarContacto = async () => {
    try {
      if (
        !nuevoContacto.nombre.trim() ||
        !nuevoContacto.telefono.trim() ||
        !nuevoContacto.relacion.trim() ||
        !nuevoContacto.direccion.trim()
      ) {
        alert("Debe completar todos los campos del contacto.");
        return;
      }
      const res = await axios.post(
        "http://localhost:3000/contacto_emergencia",
        nuevoContacto
      );
      const contactoCreado = res.data as ContactoEmergencia;
      // Agregamos ese nuevo contacto al array de contactos
      setContactos((prev) => [...prev, contactoCreado]);
      // Seleccionamos automáticamente el contacto recién creado
      setForm((prev) => ({
        ...prev,
        id_contacto_emergencia: String(contactoCreado.id_contacto),
      }));
      // Ocultamos el subform
      setShowNewContacto(false);
      // Limpiamos campos
      setNuevoContacto({
        nombre: "",
        telefono: "",
        relacion: "",
        direccion: "",
      });
      alert("Contacto de emergencia agregado correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al agregar contacto de emergencia.");
    }
  };

  // Al presionar “Guardar” en el formulario principal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación mínima (todos los campos obligatorios)
    if (
      !form.correo.trim() ||
      !form.contrasena.trim() ||
      !form.primer_nombre.trim() ||
      !form.primer_apellido.trim() ||
      !form.telefono.trim() ||
      !form.cuerpo_rut.trim() ||
      !form.dv_rut.trim() ||
      !form.fecha_nacimiento.trim() ||
      !form.id_tipo_genero ||
      !form.id_tipo_sexo ||
      !form.id_contacto_emergencia ||
      form.especialidades.length === 0
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);

    // Preparamos el payload con el formato que espera el backend
    const payload = {
      correo: form.correo.trim(),
      contrasena: form.contrasena.trim(),
      primer_nombre: form.primer_nombre.trim(),
      segundo_nombre: form.segundo_nombre.trim() || undefined,
      primer_apellido: form.primer_apellido.trim(),
      segundo_apellido: form.segundo_apellido.trim() || undefined,
      telefono: form.telefono.trim(),
      cuerpo_rut: form.cuerpo_rut.trim(),
      dv_rut: form.dv_rut.trim(),
      direccion: form.direccion.trim() || undefined,
      fecha_nacimiento: form.fecha_nacimiento, // en formato "YYYY-MM-DD"
      id_tipo_genero: Number(form.id_tipo_genero),
      id_tipo_sexo: Number(form.id_tipo_sexo),
      id_contacto_emergencia: Number(form.id_contacto_emergencia),
      especialidades: form.especialidades, // array de IDs
    };

    try {
      await createEntrenador(payload);
      alert("Entrenador creado correctamente.");
      // Redirigimos a la lista de profesores
      navigate("/admin/profesores");
    } catch (err: unknown) {
      console.error(err);
      // Si viene un mensaje del backend:
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error al crear el entrenador.");
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
            Crear Nuevo Profesor
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Correo */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Correo *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Primer nombre */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Primer nombre *
                </label>
                <input
                  type="text"
                  name="primer_nombre"
                  value={form.primer_nombre}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Segundo nombre (opcional) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Segundo nombre
                </label>
                <input
                  type="text"
                  name="segundo_nombre"
                  value={form.segundo_nombre}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Primer apellido */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Primer apellido *
                </label>
                <input
                  type="text"
                  name="primer_apellido"
                  value={form.primer_apellido}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Segundo apellido (opcional) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Segundo apellido
                </label>
                <input
                  type="text"
                  name="segundo_apellido"
                  value={form.segundo_apellido}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* RUT: cuerpo y DV */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">RUT *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cuerpo_rut"
                    placeholder="Ej: 12345678"
                    value={form.cuerpo_rut}
                    onChange={handleChange}
                    required
                    className="w-2/3 p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                  <input
                    type="text"
                    name="dv_rut"
                    placeholder="Ej: 9"
                    maxLength={1}
                    value={form.dv_rut}
                    onChange={handleChange}
                    required
                    className="w-1/3 p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
              </div>

              {/* Dirección (opcional) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fecha nacimiento *
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <span className="text-xs text-gray-500">
                  Formato: YYYY-MM-DD
                </span>
              </div>

              {/* Género */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Género *
                </label>
                <select
                  name="id_tipo_genero"
                  value={form.id_tipo_genero}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Seleccione género</option>
                  {generoOptions.map((g) => (
                    <option
                      key={g.id_tipo_genero}
                      value={g.id_tipo_genero}
                    >
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Sexo *
                </label>
                <select
                  name="id_tipo_sexo"
                  value={form.id_tipo_sexo}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Seleccione sexo</option>
                  {sexoOptions.map((s) => (
                    <option
                      key={s.id_tipo_sexo}
                      value={s.id_tipo_sexo}
                    >
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contacto de emergencia */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contacto de emergencia *
                </label>
                <select
                  name="id_contacto_emergencia"
                  value={form.id_contacto_emergencia}
                  onChange={handleContactoChange}
                  required
                  className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Seleccione contacto</option>
                  {contactos.map((c) => (
                    <option key={c.id_contacto} value={c.id_contacto}>
                      {c.nombre} ({c.telefono})
                    </option>
                  ))}
                  <option value="nuevo">Crear nuevo contacto</option>
                </select>
              </div>

              {/* Subform de “Crear nuevo contacto” */}
              {showNewContacto && (
                <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-xl font-semibold text-yellow-700 mb-3">
                    Agregar contacto de emergencia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevoContacto.nombre}
                        onChange={handleNuevoContactoChange}
                        required
                        className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="text"
                        name="telefono"
                        value={nuevoContacto.telefono}
                        onChange={handleNuevoContactoChange}
                        required
                        className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Relación *
                      </label>
                      <input
                        type="text"
                        name="relacion"
                        value={nuevoContacto.relacion}
                        onChange={handleNuevoContactoChange}
                        required
                        className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={nuevoContacto.direccion}
                        onChange={handleNuevoContactoChange}
                        required
                        className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={handleAgregarContacto}
                        className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-md font-bold hover:bg-yellow-500 transition"
                      >
                        <Check size={16} /> Agregar contacto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewContacto(false);
                          setForm((prev) => ({
                            ...prev,
                            id_contacto_emergencia: "",
                          }));
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selección de especialidades (multiselect) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Especialidades *
                </label>
                <select
                  name="especialidades"
                  multiple
                  value={form.especialidades.map(String)} // convierte a string[]
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

            {/* Botones “Guardar” y “Cancelar” */}
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
                onClick={() => navigate("/admin/profesores")}
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

export default CreateTeacher;
