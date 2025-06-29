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

const TrainerSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between flex-shrink-0">
      {/* --- Parte superior (Avatar + datos del admin) --- */}
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-cyan-500 rounded-full p-2 mb-2">
            <Users className="text-white" />
          </div>
          <h2 className="text-xl font-semibold">Trainer Name</h2>
          <p className="text-sm opacity-80">trainer@example.com</p>
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

          {/* Ejercicios y rutina */}
          <NavLink
            to="/admin/ejercicios-rutina"
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
        </nav>
      </div>

      {/* --- Botón de logout (parte inferior) --- */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
        onClick={() => {
          // Lógica de logout si la necesitas
          window.location.href = "/"; // Redirigir a la página de logout
        }}
      >
        <LogOut /> Desconectarse
      </button>
    </aside>
  );
};

export default TrainerSidebar;

