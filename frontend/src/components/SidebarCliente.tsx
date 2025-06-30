import React from "react";
import { motion } from "framer-motion";

export interface SidebarItem {
  id: string;
  icon: React.ReactElement;
  text: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface SidebarClienteProps {
  items: SidebarItem[];
  user?: { primer_nombre?: string; primer_apellido?: string; correo?: string };
}

const SidebarCliente: React.FC<SidebarClienteProps> & { SidebarLink: typeof SidebarLink } = ({ items, user }) => (
  <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-[#1a1a1f] p-6 border-r border-[#3f3f46] rounded-tr-3xl rounded-br-3xl">
    <h1 className="text-2xl font-bold text-[#5ec2d6] mb-6">TYME</h1>
    <div className="flex flex-col justify-between h-full">
      <nav className="space-y-2">
        {items.map((item) => (
          <SidebarLink {...item} key={item.id} />
        ))}
      </nav>
      {user && (
        <div className="mt-6 pt-4 border-t border-[#3f3f46]">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[#2c2c31]">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-[#5ec2d6]"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {user.primer_nombre} {user.primer_apellido}
              </p>
              <p className="text-xs text-[#9ca3af]">{user.correo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </aside>
);

// SidebarLink como propiedad estática para uso en el menú mobile
function SidebarLink({ icon, text, isActive = false, onClick }: { icon: React.ReactElement; text: string; isActive?: boolean; onClick?: () => void; }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-[#2c2c31] text-[#5ec2d6] border-l-4 border-[#5ec2d6]"
          : "text-[#9ca3af] hover:bg-[#2c2c31] hover:text-white"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: `h-5 w-5 ${isActive ? 'text-[#5ec2d6]' : 'text-[#9ca3af]'}`
      })}
      <span className="font-medium">{text}</span>
    </motion.div>
  );
}

// Exportar el link como propiedad para usarlo en el menú mobile
SidebarCliente.SidebarLink = SidebarLink;

export default SidebarCliente;
