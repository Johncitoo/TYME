import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  Home,
  Users,
  Calendar as AppWindow,
  NotebookPen,
  FolderKanban,
  BadgeDollarSign,
  School2,
  ClipboardPlus
} from "lucide-react";
import { getAllClientes } from "../services/userServices"; // <-- Importa tu servicio
import SidebarAdmin from "../components/AdminSidebar";

interface Cliente {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  cuerpo_rut: string;
  dv_rut: string;
  telefono: string;
  // Agrega otros campos que recibas y quieras mostrar
}

const sidebarLinks = [
  { to: "/home",           icon: <AppWindow />,     label: "Inicio" },
  { to: "/admin/profile",  icon: <Home />,          label: "Administrador" },
  { to: "#",               icon: <NotebookPen />,   label: "Registrar Usuarios" },
  { to: "#",               icon: <Bell />,          label: "Ejercicios y rutina" },
  { to: "#",               icon: <FolderKanban />,  label: "Plan" },
  { to: "#",               icon: <BadgeDollarSign />,label: "Pagos" },
  { to: "/admin/users",    icon: <Users />,         label: "Usuarios" }, // Ruta real
  { to: "#",               icon: <School2 />,       label: "Profesores" },
  { to: "#",               icon: <ClipboardPlus />, label: "Reportes" },
];

const UsersPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [entities, setEntities] = useState(10);

  // Fetch a los clientes al cargar
  useEffect(() => {
    getAllClientes().then(data => setClientes(data));
  }, []);

  // Búsqueda simple (por nombre o RUT)
  const filtered = clientes.filter(
    (c) =>
      (`${c.primer_nombre} ${c.primer_apellido}`.toLowerCase().includes(search.toLowerCase())) ||
      (c.cuerpo_rut && c.cuerpo_rut.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#141517]">
      {/* Sidebar */}
      <SidebarAdmin />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#141517] p-10">
        <div className="max-w-6xl w-full mx-auto">
          {/* Título */}
          <h1 className="text-4xl font-bold text-[#71e3ea] mb-8 tracking-tight">
            Todos los miembros
          </h1>
          <div className="rounded-xl bg-[#23242b] shadow-lg p-8 mx-auto w-full max-w-4xl border border-[#2c2c33]">
            <h2 className="text-[#71e3ea] text-2xl font-bold mb-4">Clientes del gimnasio</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <label className="text-[#bdbdbd] text-base mr-2 font-medium">Mostrar</label>
                <select
                  className="bg-[#191a1d] text-[#71e3ea] border border-[#2c2c33] rounded-md px-3 py-1 focus:outline-none"
                  value={entities}
                  onChange={(e) => setEntities(Number(e.target.value))}
                >
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar"
                  className="pl-10 pr-4 py-2 rounded-lg bg-[#191a1d] text-white placeholder:text-[#3e4044] border border-[#2c2c33] focus:outline-none w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4044]" />
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-[#71e3ea] font-semibold border-b border-[#3e4044]">
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">RUT</th>
                    <th className="py-2 px-4">Correo</th>
                    <th className="py-2 px-4">Teléfono</th>
                    {/* Agrega más columnas si quieres */}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id_usuario}
                      className="hover:bg-[#282a33]/60 transition border-b border-[#2c2c33] last:border-b-0"
                    >
                      <td className="py-2 px-4 text-white">{c.primer_nombre} {c.primer_apellido}</td>
                      <td className="py-2 px-4 text-[#bdbdbd]">{c.cuerpo_rut}-{c.dv_rut}</td>
                      <td className="py-2 px-4 text-[#bdbdbd]">{c.correo}</td>
                      <td className="py-2 px-4 text-[#bdbdbd]">{c.telefono}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#71e3ea] opacity-60">
                        No se encontraron miembros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer: paginación */}
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2 bg-[#191a1d] text-[#bdbdbd] border border-[#3e4044] rounded-md font-medium hover:bg-[#232328] hover:text-[#71e3ea] transition">
                Anterior
              </button>
              <button className="px-5 py-2 bg-[#191a1d] text-[#bdbdbd] border border-[#3e4044] rounded-md font-medium hover:bg-[#232328] hover:text-[#71e3ea] transition">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersPage;


