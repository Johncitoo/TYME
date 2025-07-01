import React, { useState, useEffect } from "react";
import {
  Calendar as HomeIcon,
  BookCheck,
  School2,
  Users,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// --- Frases motivacionales ---
const frasesMotivacionales = [
  "No cuentes los días, haz que los días cuenten. – Muhammad Ali"
];

// --- Pantalla de Inicio ---
const HomeContent = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [frase, setFrase] = useState("");

  const generarFrase = () => {
    const aleatoria = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
    setFrase(aleatoria);
  };

  useEffect(() => {
    generarFrase(); // Al cargar
    const intervalId = setInterval(generarFrase, 15000); // Cada 15 segundos
    return () => clearInterval(intervalId); // Limpieza al desmontar
  }, []);

  return (
    <section className="p-10 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Pantalla de Inicio</h2>

      {/* Frase motivacional */}
      <div className="bg-[#F3E8FF] text-purple-800 p-4 rounded-lg shadow text-center font-medium italic relative">
        {frase}
        <button
          onClick={generarFrase}
          title="Otra frase"
          className="absolute top-2 right-2 bg-white text-purple-700 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-white p-6 rounded-lg shadow w-fit">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="!border-0"
        />
      </div>
    </section>
  );
};

// --- Crear Clases ---
const CrearClaseContent = () => (
  <section className="p-10">
    <h2 className="text-2xl font-bold mb-4">Crear Clase</h2>
    <p>Formulario o funcionalidades para crear una nueva clase.</p>
  </section>
);

// --- Crear Rutinas ---
const CrearRutinaContent = () => (
  <section className="p-10">
    <h2 className="text-2xl font-bold mb-4">Crear Rutina</h2>
    <p>Formulario o funcionalidades para crear una nueva rutina.</p>
  </section>
);

// --- Profesor ---
const ProfesorContent = () => (
  <section className="p-10">
    <h2 className="text-2xl font-bold mb-4">Profesores</h2>
    <p>Listado o gestión de profesores.</p>
  </section>
);

// --- Tipo de ítem del sidebar ---
interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  component: React.FC;
}

// --- Items del sidebar ---
const sidebarItems: SidebarItem[] = [
  { label: "Inicio", icon: <HomeIcon size={20} />, component: HomeContent },
  { label: "Clases", icon: <BookCheck size={20} />, component: CrearClaseContent },
  { label: "Rutinas", icon: <BookCheck size={20} />, component: CrearRutinaContent },
  { label: "Profesor", icon: <School2 size={20} />, component: ProfesorContent },
];

// --- Componente principal ---
const TrainerDashboard: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SidebarItem>(sidebarItems[0]);
  const [trainerName, setTrainerName] = useState("Entrenador");
  const [trainerEmail, setTrainerEmail] = useState("correo@example.com");

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setTrainerName(user.nombre || "Entrenador");
        setTrainerEmail(user.correo || "correo@example.com");
      } catch (err) {
        console.error("Error al parsear el usuario desde localStorage", err);
      }
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Info del usuario */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-cyan-500 rounded-full p-2 mb-2">
              <Users className="text-white" />
            </div>
            <h2 className="text-xl font-semibold">{trainerName}</h2>
            <p className="text-sm opacity-80">{trainerEmail}</p>
          </div>

          {/* Botones del menú */}
          <nav className="space-y-4">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedItem(item)}
                className={`flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg transition-colors ${
                  selectedItem.label === item.label
                    ? "bg-cyan-300 text-black"
                    : "hover:bg-cyan-500 text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
          onClick={() => (window.location.href = "/")}
        >
          <LogOut /> Desconectarse
        </button>
      </aside>

      {/* --- Contenido principal --- */}
      <main className="flex-1 flex flex-col bg-[#f5f5f5] overflow-auto">
        <header className="px-12 py-6 bg-white shadow-md sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedItem.label === "Inicio"
              ? "Bienvenido, Entrenador"
              : `Sección de ${selectedItem.label}`}
          </h1>
        </header>

        {/* Render dinámico del componente */}
        <selectedItem.component />
      </main>
    </div>
  );
};

export default TrainerDashboard;
