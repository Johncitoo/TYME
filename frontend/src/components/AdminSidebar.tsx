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
} from "lucide-react";

const SidebarAdmin: React.FC = () => {
  return (
    <aside className="w-64 bg-black bg-opacity-70 backdrop-blur-md text-white p-6 flex flex-col justify-between shadow-xl border-r border-cyan-700">
      {/* Top: Admin Info */}
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-cyan-500 rounded-full p-3 mb-2 shadow-md">
            <Users className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Administrator Name</h2>
          <p className="text-sm text-cyan-300">admin@example.com</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavItem to="/admin" label="Inicio" icon={<HomeIcon />} end />
          <NavItem to="/admin/profile" label="Administrador" icon={<HomeIcon />} />
          <NavItem to="/admin/RegisterUsers" label="Registrar Usuarios" icon={<NotebookPen />} />
          <NavItem to="/admin/ejercicios" label="Ejercicios y rutina" icon={<Bell />} />
          <NavItem to="/admin/plan" label="Plan" icon={<FolderKanban />} />
          <NavItem to="/admin/pagos" label="Pagos" icon={<BadgeDollarSign />} />
          <NavItem to="/admin/users" label="Usuarios" icon={<Users />} />
          <NavItem to="/admin/profesores" label="Profesores" icon={<School2 />} />
        </nav>
      </div>

      {/* Logout */}
      <button
        className="mt-8 flex items-center gap-2 px-4 py-2 text-white bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors font-medium"
        onClick={() => (window.location.href = "/")}
      >
        <LogOut className="w-5 h-5" />
        Desconectarse
      </button>
    </aside>
  );
};

const NavItem = ({
  to,
  icon,
  label,
  end = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-cyan-400 text-black shadow"
          : "hover:bg-cyan-600 hover:text-white text-white"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default SidebarAdmin;
