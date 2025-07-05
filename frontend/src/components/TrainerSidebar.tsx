import React from "react";
import { LogOut, Users } from "lucide-react";
import { logout } from "../utils/logout";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  component: React.FC<any>;
}

interface TrainerSidebarProps {
  items: SidebarItem[];
  activeItemPath: string;
  onSelectItem: (item: SidebarItem) => void;
  trainerName: string;
  trainerEmail: string;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({
  items,
  activeItemPath,
  onSelectItem,
  trainerName,
  trainerEmail,
}) => (
  <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between flex-shrink-0" role="navigation">
    <div>
      <div className="flex flex-col items-center mb-8">
        <div className="bg-cyan-500 rounded-full p-2 mb-2">
          <Users className="text-white" />
        </div>
        <h2 className="text-xl font-semibold">{trainerName || "Entrenador"}</h2>
        <p className="text-sm opacity-80">{trainerEmail || "email@entrenador.com"}</p>
      </div>
      <nav className="space-y-4">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => onSelectItem(item)}
            aria-current={activeItemPath === item.path ? "page" : undefined}
            className={`flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg transition-colors focus:outline-none ${
              activeItemPath === item.path
                ? "bg-cyan-300 text-black"
                : "hover:bg-cyan-500 text-white"
            }`}
            type="button"
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
    <button
  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
  onClick={logout}
  type="button"
>
  <LogOut /> Desconectarse
</button>
  </aside>
);

export default TrainerSidebar;
