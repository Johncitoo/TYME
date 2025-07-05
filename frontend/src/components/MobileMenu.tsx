import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Home, Dumbbell, CalendarCheck, User, LogOut, Menu } from "lucide-react";
import clsx from "clsx";
import { logout } from "../utils/logout";

const MENU_OPTIONS = [
  {
    label: "Inicio",
    icon: <Home className="w-6 h-6 mr-3" />,
    to: "/home",
  },
  {
    label: "Mi rutina",
    icon: <Dumbbell className="w-6 h-6 mr-3" />,
    to: "/rutina",
  },
  {
    label: "Clases disponibles",
    icon: <CalendarCheck className="w-6 h-6 mr-3" />,
    to: "/clases",
  },
  {
    label: "Perfil",
    icon: <User className="w-6 h-6 mr-3" />,
    to: "/editar-perfil",
  },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleClick = () => setOpen(false);
  const handleLogout = () => logout();

  return (
    <>
      {/* Botón menú flotante y siempre visible */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-zinc-900 border border-cyan-600 shadow-xl w-14 h-14 rounded-2xl text-cyan-300 hover:bg-cyan-950/70 transition
              fixed top-4 left-4 z-50" // 👈 Esto lo deja siempre flotante
            aria-label="Abrir menú"
          >
            <Menu className="w-9 h-9" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="pt-6 pb-2 bg-gradient-to-t from-zinc-950 via-zinc-900 to-cyan-950 border-none rounded-t-3xl max-w-md mx-auto shadow-2xl flex flex-col min-h-[380px]">
          <div className="mx-auto mb-4 mt-1 w-16 h-1.5 bg-zinc-700 rounded-full" />
          <div className="flex flex-col px-3 gap-1 mb-3">
            {MENU_OPTIONS.map((opt) => {
              const active = location.pathname === opt.to;
              return (
                <Link
                  key={opt.label}
                  to={opt.to}
                  onClick={handleClick}
                  className={clsx(
                    "flex items-center py-4 px-4 my-1 rounded-2xl font-semibold text-lg transition-all duration-150",
                    active
                      ? "bg-cyan-900/80 text-cyan-200 shadow-lg"
                      : "hover:bg-cyan-800/50 hover:text-cyan-100 text-zinc-200"
                  )}
                  style={{
                    borderLeft: active ? "5px solid #22d3ee" : "5px solid transparent",
                  }}
                >
                  {opt.icon}
                  {opt.label}
                  {active && (
                    <span className="ml-auto w-3 h-3 rounded-full bg-cyan-300 shadow-sm animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-cyan-900 my-2" />
          <button
            className="flex items-center py-4 px-4 w-full rounded-2xl font-semibold text-lg text-red-500 hover:bg-red-800/10 transition-all mt-2 mb-10"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6 mr-3" />
            Cerrar sesión
          </button>
        </DrawerContent>
      </Drawer>

      {/* Título estático y centrado */}
      <header className="w-full flex items-center justify-center px-3 py-4">
        <span className="text-xl font-bold text-cyan-400 text-center flex-1">TYME</span>
        {/* Espacio fantasma para centrar */}
        <div className="w-14" />
      </header>
    </>
  );
}
