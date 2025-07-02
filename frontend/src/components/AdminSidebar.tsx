// frontend/src/components/SidebarAdmin.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Users,
  Home as HomeIcon,
  NotebookPen,
  Bell,
  FolderKanban,
  BadgeDollarSign,
  School2,
  ClipboardPlus,
} from "lucide-react";
import { logout } from "../utils/logout";

const SidebarAdmin: React.FC = () => {
  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between flex-shrink-0">
      {/* --- Parte superior (Avatar + datos del admin) --- */}
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-cyan-500 rounded-full p-2 mb-2">
            <Users className="text-white" />
          </div>
          <h2 className="text-xl font-semibold">Administrator Name</h2>
          <p className="text-sm opacity-80">admin@example.com</p>
        </div>

        {/* --- Navegación --- */}
        <nav className="space-y-4">
          {/* Inicio */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <HomeIcon /> Inicio
          </NavLink>

          {/* Administrador */}
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <HomeIcon /> Administrador
          </NavLink>

          {/* Registrar Usuarios */}
          <NavLink
            to="/admin/RegisterUsers"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <NotebookPen /> Registrar Usuarios
          </NavLink>

          {/* Ejercicios y rutina */}
          <NavLink
            to="/admin/ejercicios"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <Bell /> Ejercicios y rutina
          </NavLink>

          {/* Plan */}
          <NavLink
            to="/admin/plan"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <FolderKanban /> Plan
          </NavLink>

          {/* Pagos */}
          <NavLink
            to="/admin/pagos"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <BadgeDollarSign /> Pagos
          </NavLink>

          {/* Usuarios */}
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <Users /> Usuarios
          </NavLink>

          {/* Profesores */}
          <NavLink
            to="/admin/profesores"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <School2 /> Profesores
          </NavLink>

          {/* Reportes */}
          <NavLink
            to="/admin/reportes"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`
            }
          >
            <ClipboardPlus /> Reportes
          </NavLink>
        </nav>
      </div>

      {/* --- Botón de logout (parte inferior) --- */}
      <button
  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
  onClick={logout}
>
  <LogOut /> Desconectarse
</button>
    </aside>
  );
};

export default SidebarAdmin;

