import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Menu, Dumbbell, CalendarDays, LogOut, User, Search, Home } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function DashboardCliente() {
  const usuario = useAuthStore((state) => state.usuario);

  // Estados para info dinámica
  const [proximaClase, setProximaClase] = useState<any | null>(null);
  const [rutina, setRutina] = useState<any | null>(null);
  const [clasesCalendario, setClasesCalendario] = useState<Date[]>([]);
  const [fecha, setFecha] = useState<Date | undefined>(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("Mi rutina");

  // Sidebar items
  const sidebarItems: { id: string; icon: React.ReactElement; text: string }[] = [
    { id: "Inicio", icon: <Home />, text: "Inicio" },
    { id: "Mi rutina", icon: <Dumbbell />, text: "Mi rutina" },
    { id: "Clases disponibles", icon: <CalendarDays />, text: "Clases disponibles" },
    { id: "Perfil", icon: <User />, text: "Perfil" },
    { id: "Cerrar sesión", icon: <LogOut />, text: "Cerrar sesión" },
  ];

  // Fetch de la info del backend al montar el componente
  useEffect(() => {
    if (!usuario?.id_usuario) return;

    // 1. Próxima clase
    fetch(`http://localhost:3000/api/clases/proxima?usuarioId=${usuario.id_usuario}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setProximaClase(data))
      .catch(() => setProximaClase(null));

    // 2. Rutina activa
    fetch(`http://localhost:3000/api/rutinas/actual?usuarioId=${usuario.id_usuario}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setRutina(data))
      .catch(() => setRutina(null));

    // 3. Fechas de clases para calendario
    fetch(`http://localhost:3000/api/clases/fechas?usuarioId=${usuario.id_usuario}`)
      .then(res => res.ok ? res.json() : [])
      .then(fechas =>
        setClasesCalendario(
          Array.isArray(fechas)
            ? fechas.map((f: string) => new Date(f))
            : []
        )
      )
      .catch(() => setClasesCalendario([]));
  }, [usuario]);

  // FUNCIONES DE RENDER (para evitar errores si no hay datos)
  const renderClase = () =>
    proximaClase ? (
      <>
        <p className="font-medium text-[#5ec2d6]">{proximaClase.nombre}</p>
        <p className="text-sm text-[#9ca3af]">
          {proximaClase.hora} – {proximaClase.ubicacion}
        </p>
      </>
    ) : (
      <p className="text-sm text-[#9ca3af]">No hay clases próximas.</p>
    );

  const renderRutina = () =>
    rutina ? (
      <ul className="list-disc pl-5 space-y-1 text-sm text-[#f1f5f9]">
        {rutina.ejercicios?.map((ej: any, i: number) => (
          <li key={i}>
            {ej.nombre} – {ej.series}x{ej.repeticiones}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-[#9ca3af]">No tienes rutina activa.</p>
    );

  // Para el calendario, marcar días con clases
  const classNamesForDay = (date: Date) => {
    const isClase = clasesCalendario.some(
      (f) => f.toDateString() === date.toDateString()
    );
    return isClase ? "bg-[#5ec2d6] text-[#0c0c0f] rounded" : undefined;
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0c0c0f] text-[#f1f5f9] md:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-[#1a1a1f] p-6 border-r border-[#3f3f46] rounded-tr-3xl rounded-br-3xl">
        <h1 className="text-2xl font-bold text-[#5ec2d6] mb-6">TYME</h1>
        <div className="flex flex-col justify-between h-full">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarLink
                key={item.id}
                icon={item.icon}
                text={item.text}
                isActive={activeLink === item.text}
                onClick={() => setActiveLink(item.text)}
              />
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-[#3f3f46]">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[#2c2c31]">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-[#5ec2d6]"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {usuario?.primer_nombre} {usuario?.primer_apellido}
                </p>
                <p className="text-xs text-[#9ca3af]">{usuario?.correo}</p>
              </div>
            </div>
            <SidebarLink
              icon={<LogOut />}
              text="Cerrar sesión"
              isActive={false}
              onClick={() => {
                // Aquí pones tu lógica de logout
                window.location.href = "/";
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-4 md:px-10 md:pt-6">
        {/* Mobile Header */}
        <div className="relative z-50 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4 md:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              className="p-2 text-[#5ec2d6] bg-[#1a1a1f] rounded-md border border-[#3f3f46]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-[#5ec2d6] whitespace-nowrap">
              ¡Hola, {usuario?.primer_nombre || ""}! 👋
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-8 pr-4 py-2 rounded-md bg-[#2c2c31] text-sm placeholder-[#9ca3af] border border-[#3f3f46] text-[#f1f5f9]"
              />
            </div>
            <Button variant="outline" className="text-xs px-3 py-2 whitespace-nowrap"
              onClick={() => {
                // Tu lógica de logout aquí también
                window.location.href = "/";
              }}>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu + Blur Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 md:hidden"
              />
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 6 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-20 left-4 right-4 z-50 bg-[#1a1a1f] p-4 border border-[#3f3f46] rounded-md shadow-lg md:hidden"
              >
                {sidebarItems.map((item) => (
                  <SidebarLink
                    key={item.id}
                    icon={item.icon}
                    text={item.text}
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveLink(item.text);
                    }}
                    isActive={activeLink === item.text}
                  />
                ))}
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
          {/* Próxima clase */}
          <Card className="bg-[#1a1a1f] border border-[#3f3f46] rounded-lg shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <CalendarDays className="mr-3 h-5 w-5 text-[#5ec2d6]" />
                <CardTitle className="font-semibold text-lg text-[#f1f5f9]">
                  Próxima clase
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {renderClase()}
            </CardContent>
          </Card>

          {/* Rutina de hoy */}
          <Card className="bg-[#1a1a1f] border border-[#3f3f46] rounded-lg shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Dumbbell className="mr-3 h-5 w-5 text-[#5ec2d6]" />
                <CardTitle className="font-semibold text-lg text-[#f1f5f9]">
                  Rutina de hoy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {renderRutina()}
            </CardContent>
          </Card>

          {/* Calendario */}
          <Card className="col-span-1 xl:col-span-2 bg-[#1a1a1f] border border-[#3f3f46] rounded-lg shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <CalendarDays className="mr-3 h-5 w-5 text-[#5ec2d6]" />
                <CardTitle className="font-semibold text-lg text-[#f1f5f9]">
                  Calendario
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden w-full mx-auto max-w-[428px] md:max-w-full">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  className="w-full rounded-md bg-[#2c2c31]"
                  classNames={{
                    caption: "flex justify-center items-center py-2 text-[#f1f5f9]",
                    nav_button: "text-[#f1f5f9] opacity-60 hover:opacity-100 p-1",
                    table: "table-fixed w-full border-collapse",
                    head_cell: "text-[#9ca3af] py-1",
                    cell: "p-0",
                    day: "flex-1 aspect-square flex items-center justify-center text-sm text-[#f1f5f9] hover:bg-[#3a3a3f] rounded",
                    day_selected: "bg-[#5ec2d6] text-[#0c0c0f]",
                  }}
                  modifiers={{
                    hasClass: (date: Date) => clasesCalendario.some(f => f.toDateString() === date.toDateString())
                  }}
                  modifiersClassNames={{
                    hasClass: "bg-[#5ec2d6] text-[#0c0c0f] rounded"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// SidebarLink (igual que antes)
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
