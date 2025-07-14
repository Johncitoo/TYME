// src/pages/RegisterUsers.tsx

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Users,
  Home,
  NotebookPen,
  FolderKanban,
  BadgeDollarSign,
  School2,
  ClipboardPlus,
  AppWindow,
  Bell,
} from "lucide-react";
import axios from "axios";
import SidebarAdmin from "@/components/AdminSidebar";

// Opciones estáticas de género y sexo
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

// Links laterales del sidebar
const sidebarLinks = [
  { to: "/home", icon: <AppWindow />, label: "Inicio" },
  { to: "/admin/profile", icon: <Home />, label: "Administrador" },
  { to: "/admin/register", icon: <NotebookPen />, label: "Registrar Usuarios" },
  { to: "#", icon: <Bell />, label: "Ejercicios y rutina" },
  { to: "#", icon: <FolderKanban />, label: "Plan" },
  { to: "#", icon: <BadgeDollarSign />, label: "Pagos" },
  { to: "/admin/users", icon: <Users />, label: "Usuarios" },
  { to: "#", icon: <School2 />, label: "Profesores" },
  { to: "#", icon: <ClipboardPlus />, label: "Reportes" },
];

const RegisterUsers: React.FC = () => {
  /** Interfaces para los datos que vienen del back */
  interface Membresia {
    id_membresia: number;
    nombre: string;
    descripcion: string;
    precio: string;
    duracion_dias: number;
  }
  interface Contacto {
    id_contacto: number;
    nombre: string;
    telefono: string;
    relacion: string;
    direccion: string;
  }
  interface Entrenador {
    id_entrenador: number;
    usuario: {
      id_usuario: number;
      primer_nombre: string;
      segundo_nombre: string;
      primer_apellido: string;
      segundo_apellido: string;
      // ...(otros campos de Usuario si los necesitas)
    };
  }

  /** Estados para poblar los select */
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);

  /** Control para mostrar/ocultar el subform de “nuevo contacto” */
  const [showNewContacto, setShowNewContacto] = useState(false);

  /** Estado para el nuevo contacto (antes de enviarlo) */
  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    telefono: "",
    relacion: "",
    direccion: "",
  });

  /** Estado general del formulario principal */
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
    id_membresia: "",
    id_entrenador: "", // <-- NUEVO campo añadido aquí
  });

  // -------------------- useEffects para cargar datos --------------------

  // 1) Cargar contactos de emergencia
  useEffect(() => {
    axios
      .get("http://localhost:3000/contacto_emergencia")
      .then((res) => setContactos(res.data))
      .catch(() => setContactos([]));
  }, []);

  // 2) Cargar membresías
  useEffect(() => {
    axios
      .get("http://localhost:3000/membresia")
      .then((res) => setMembresias(res.data))
      .catch(() => setMembresias([]));
  }, []);

  // 3) Cargar entrenadores (¡este es el dropdown que faltaba!)
  useEffect(() => {
    axios
      .get("http://localhost:3000/entrenador")
      .then((res) => setEntrenadores(res.data))
      .catch(() => setEntrenadores([]));
  }, []);

  // -------------------- Handlers --------------------

  /** Handler genérico para inputs y selects del form principal */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Handler específico para el select “Contacto de emergencia” */
  const handleContactoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "nuevo") {
      setShowNewContacto(true);
      setForm({ ...form, id_contacto_emergencia: "" });
    } else {
      setShowNewContacto(false);
      setForm({ ...form, id_contacto_emergencia: value });
    }
  };

  /** Handler para inputs del subform “nuevo contacto” */
  const handleNuevoContactoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoContacto({ ...nuevoContacto, [e.target.name]: e.target.value });
  };

  /** POST para crear un nuevo contacto de emergencia */
  const handleAgregarContacto = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/contacto_emergencia",
        nuevoContacto
      );
      const contactoCreado = res.data as Contacto;
      // Agregamos a la lista local y seleccionamos su ID
      setContactos([...contactos, contactoCreado]);
      setForm({
        ...form,
        id_contacto_emergencia: String(contactoCreado.id_contacto),
      });
      setShowNewContacto(false);
      setNuevoContacto({ nombre: "", telefono: "", relacion: "", direccion: "" });
      alert("Contacto de emergencia agregado correctamente");
    } catch {
      alert("Error al agregar contacto de emergencia");
    }
  };

  /** POST final para crear el usuario-cliente completo */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        correo,
        contrasena,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        telefono,
        cuerpo_rut,
        dv_rut,
        direccion,
        fecha_nacimiento,
        id_tipo_genero,
        id_tipo_sexo,
        id_contacto_emergencia,
        id_membresia,
        id_entrenador,
      } = form;

      const payload = {
        // ---- Campos de la tabla “usuario” ----
        correo,
        contrasena,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        telefono,
        cuerpo_rut,
        dv_rut,
        direccion,
        fecha_nacimiento,

        // ---- Campos “lookup” y “cliente” ----
        id_tipo_usuario: 2, // forzamos 2 = “cliente”
        id_tipo_genero: Number(id_tipo_genero),
        id_tipo_sexo: Number(id_tipo_sexo),
        id_contacto_emergencia: Number(id_contacto_emergencia),

        // En tu DB, “cliente” espera id_tipo_membresia y id_entrenador:
        id_tipo_membresia: Number(id_membresia),
        id_entrenador: Number(id_entrenador),
      };

      await axios.post("http://localhost:3000/users", payload);

      alert("Usuario registrado correctamente");

      // Limpiar formulario
      setForm({
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
        id_membresia: "",
        id_entrenador: "",
      });
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      alert(axiosError.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f4f6]">
      {/* -------------------- Sidebar -------------------- */}
      <SidebarAdmin />

      {/* -------------------- Contenido Principal -------------------- */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#f4f4f6] p-10">
        <div className="max-w-4xl w-full mx-auto">
          <h1 className="text-4xl font-bold text-[#d2b112] mb-8 tracking-tight">
            Nuevo miembro
          </h1>
          <div className="rounded-xl bg-[#72c3e9] shadow-lg p-8 mx-auto w-full max-w-2xl border border-[#c7e6ef]">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ---- Campos de la tabla “usuario” ---- */}
                <div>
                  <label className="block font-bold mb-1 text-white">Correo</label>
                  <input
                    type="email"
                    name="correo"
                    required
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    required
                    value={form.contrasena}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Primer nombre
                  </label>
                  <input
                    type="text"
                    name="primer_nombre"
                    required
                    value={form.primer_nombre}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Segundo nombre
                  </label>
                  <input
                    type="text"
                    name="segundo_nombre"
                    value={form.segundo_nombre}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Primer apellido
                  </label>
                  <input
                    type="text"
                    name="primer_apellido"
                    required
                    value={form.primer_apellido}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Segundo apellido
                  </label>
                  <input
                    type="text"
                    name="segundo_apellido"
                    value={form.segundo_apellido}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    required
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">RUT</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="cuerpo_rut"
                      required
                      value={form.cuerpo_rut}
                      onChange={handleChange}
                      placeholder="Ej: 22222222"
                      className="w-2/3 p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                    />
                    <input
                      type="text"
                      name="dv_rut"
                      required
                      value={form.dv_rut}
                      onChange={handleChange}
                      placeholder="Ej: 2"
                      maxLength={1}
                      className="w-1/3 p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    required
                    value={form.direccion}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Fecha nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    required
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                    pattern="\d{4}-\d{2}-\d{2}"
                  />
                  <span className="text-xs text-white">Formato: YYYY-MM-DD</span>
                </div>

                {/* ---- Campos lookup y cliente ---- */}
                <div>
                  <label className="block font-bold mb-1 text-white">Género</label>
                  <select
                    name="id_tipo_genero"
                    required
                    value={form.id_tipo_genero}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  >
                    <option value="">Seleccione género</option>
                    {generoOptions.map((g) => (
                      <option key={g.id_tipo_genero} value={g.id_tipo_genero}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">Sexo</label>
                  <select
                    name="id_tipo_sexo"
                    required
                    value={form.id_tipo_sexo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  >
                    <option value="">Seleccione sexo</option>
                    {sexoOptions.map((s) => (
                      <option key={s.id_tipo_sexo} value={s.id_tipo_sexo}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Plan (Membresía)
                  </label>
                  <select
                    name="id_membresia"
                    required
                    value={form.id_membresia}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  >
                    <option value="">Seleccione un plan</option>
                    {membresias.map((m) => (
                      <option key={m.id_membresia} value={m.id_membresia}>
                        {m.nombre} ({m.duracion_dias} días, ${m.precio})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Contacto de emergencia
                  </label>
                  <select
                    name="id_contacto_emergencia"
                    value={form.id_contacto_emergencia}
                    onChange={handleContactoChange}
                    required
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  >
                    <option value="">Seleccione contacto</option>
                    {contactos.map((c: Contacto) => (
                      <option key={c.id_contacto} value={c.id_contacto}>
                        {c.nombre} ({c.telefono})
                      </option>
                    ))}
                    <option value="nuevo">Crear nuevo contacto</option>
                  </select>
                </div>

                {/* ------ NUEVO SELECT “Entrenador” ------ */}
                <div>
                  <label className="block font-bold mb-1 text-white">
                    Entrenador
                  </label>
                  <select
                    name="id_entrenador"
                    required
                    value={form.id_entrenador}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                  >
                    <option value="">Seleccione un entrenador</option>
                    {entrenadores.map((e) => (
                      <option key={e.id_entrenador} value={e.id_entrenador}>
                        {e.usuario.primer_nombre} {e.usuario.primer_apellido}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ------------------------------------------ */}
              </div>

              {/* ------ Subformulario para crear un nuevo contacto ------ */}
              {showNewContacto && (
                <div className="mt-8 mb-4 bg-[#4bbadf]/30 p-4 rounded-lg border border-[#c7e6ef]">
                  <h3 className="text-xl font-bold text-[#12547e] mb-3">
                    Agregar contacto de emergencia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1b4769] font-semibold mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevoContacto.nombre}
                        onChange={handleNuevoContactoChange}
                        className="w-full p-2 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#1b4769] font-semibold mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        name="telefono"
                        value={nuevoContacto.telefono}
                        onChange={handleNuevoContactoChange}
                        className="w-full p-2 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#1b4769] font-semibold mb-1">
                        Relación
                      </label>
                      <input
                        type="text"
                        name="relacion"
                        value={nuevoContacto.relacion}
                        onChange={handleNuevoContactoChange}
                        className="w-full p-2 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#1b4769] font-semibold mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={nuevoContacto.direccion}
                        onChange={handleNuevoContactoChange}
                        className="w-full p-2 rounded-md bg-white text-[#1b4769] border-none focus:outline-none"
                        required
                      />
                    </div>
                    <div className="col-span-2 flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={handleAgregarContacto}
                        className="bg-[#ffe233] text-[#3189b8] px-6 py-2 rounded-md font-bold shadow hover:bg-[#ffe84d] transition"
                      >
                        Agregar contacto
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewContacto(false)}
                        className="ml-4 bg-white text-[#3189b8] px-6 py-2 rounded-md border border-[#c7e6ef] font-bold shadow hover:bg-[#eef5fa] transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------ Botones de acción ------ */}
              <div className="flex justify-end mt-8 gap-4">
                <button
                  type="submit"
                  className="bg-[#ffe233] text-[#3189b8] px-7 py-2 rounded-md font-bold shadow hover:bg-[#ffe84d] transition"
                >
                  Agregar miembro
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
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
                      id_membresia: "",
                      id_entrenador: "",
                    })
                  }
                  className="bg-white text-[#3189b8] px-7 py-2 rounded-md border border-[#c7e6ef] font-bold shadow hover:bg-[#eef5fa] transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterUsers;




