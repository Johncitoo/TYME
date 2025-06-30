import React from "react";
import {
  LogOut,
  Users,
} from "lucide-react";

// Tipo local para ítems
interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  bgColorClass: string;
  component: React.FC;
}

interface TrainerSidebarProps {
  items: SidebarItem[];
  activeItemPath: string;
  onSelectItem: (item: SidebarItem) => void;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({
  items,
  activeItemPath,
  onSelectItem,
}) => {
  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between flex-shrink-0">
      {/* Parte superior (datos del entrenador) */}
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-cyan-500 rounded-full p-2 mb-2">
            <Users className="text-white" />
          </div>
          <h2 className="text-xl font-semibold">Trainer Name</h2>
          <p className="text-sm opacity-80">trainer@example.com</p>
        </div>

        {/* Navegación */}
        <nav className="space-y-4">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => onSelectItem(item)}
              className={`flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg transition-colors ${
                activeItemPath === item.path
                  ? "bg-cyan-300 text-black"
                  : "hover:bg-cyan-500 text-white"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Botón de logout */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
        onClick={() => (window.location.href = "/")}
      >
        <LogOut /> Desconectarse
      </button>
    </aside>
  );
};

export default TrainerSidebar;
