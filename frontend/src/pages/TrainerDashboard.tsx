import React, { useState, type JSX } from "react";
import {
  Calendar as HomeIcon,
  BookCheck,
  School2,
  Users,
  RefreshCcw,
  Dumbbell,
  UserCheck,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useAuthStore } from "../store/authStore";
import ClassForm from "../components/ClassForm";
import RoutineForm from "../components/RoutineForm";
import ClientsTrainerDashboard from "../components/ClientsTrainerDashboard";
import TrainerSidebar from "../components/TrainerSidebar";

// --- Frases motivacionales ---
const frasesMotivacionales = [
  "No cuentes los días, haz que los días cuenten. – Muhammad Ali",
  "La motivación es lo que te pone en marcha, el hábito es lo que hace que sigas. – Jim Ryun",
  "El dolor es temporal, el orgullo es para siempre.",
  "Entrena duro o vete a casa.",
  "El éxito no es para los que creen que pueden hacerlo, sino para los que lo hacen.",
  "Hazlo por la versión de ti que dijiste que no se rendiría.",
  "Los cuerpos de verano se construyen en invierno.",
  "La única forma de hacer un gran trabajo es amar lo que haces. – Steve Jobs",
  "Cree que puedes y ya estarás a medio camino. – Theodore Roosevelt",
  "No te detengas cuando estés cansado. Detente cuando hayas terminado.",
  "Tu cuerpo puede soportar casi cualquier cosa. Es tu mente la que tienes que convencer.",
  "La disciplina es el puente entre las metas y los logros. – Jim Rohn",
  "Si no hay lucha, no hay progreso. – Frederick Douglass",
  "El único entrenamiento malo es el que no se hace.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día. – Robert Collier",
  "La fuerza no viene de la capacidad física, sino de una voluntad indomable. – Mahatma Gandhi",
  "Caerse siete veces y levantarse ocho. – Proverbio japonés",
  "Un campeón tiene miedo de perder. Todos los demás tienen miedo de ganar. – Billie Jean King",
  "La diferencia entre lo imposible y lo posible reside en la determinación de una persona. – Tommy Lasorda",
  "Nunca es demasiado tarde para ser lo que podrías haber sido. – George Eliot",
  "Empieza donde estás. Usa lo que tienes. Haz lo que puedas. – Arthur Ashe",
  "No deseo el éxito, trabajo para él.",
  "Lo que te falta en talento lo puedes compensar con deseo, ajetreo y entregando el 110% todo el tiempo. – Don Zimmer",
  "La vida empieza al final de tu zona de confort. – Neale Donald Walsch",
  "Si quieres algo que nunca has tenido, tendrás que hacer algo que nunca has hecho.",
  "El dolor que sientes hoy es la fuerza que sentirás mañana.",
];

// --- Pantalla de Inicio ---
const HomeContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [frase, setFrase] = useState("");

  const generarFrase = () => {
    const aleatoria =
      frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
    setFrase(aleatoria);
  };

  React.useEffect(() => {
    generarFrase();
    const intervalId = setInterval(generarFrase, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="p-10 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Pantalla de Inicio</h2>
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

const CrearClaseContent: React.FC = () => (
  <section className="p-10">
    <ClassForm />
  </section>
);

const CrearRutinaContent: React.FC = () => {
  const usuario = useAuthStore((state) => state.usuario);
  return (
    <section className="p-10">
      <RoutineForm idEntrenador={usuario?.id_usuario ?? 0} />
    </section>
  );
};

const ProfesoresContent: React.FC = () => (
  <section className="p-10">
    <h2 className="text-2xl font-bold mb-4">Profesores</h2>
    <p>Listado o gestión de profesores.</p>
  </section>
);

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  component: React.FC | (() => JSX.Element);
  path: string;
}

const TrainerDashboard: React.FC = () => {
  const usuario = useAuthStore((state) => state.usuario);

  const sidebarItems: SidebarItem[] = [
    {
      label: "Inicio",
      icon: <HomeIcon size={20} />,
      path: "inicio",
      component: HomeContent,
    },
    {
      label: "Crear Clase",
      icon: <BookCheck size={20} />,
      path: "crear-clase",
      component: CrearClaseContent,
    },
    {
      label: "Crear Rutina",
      icon: <Dumbbell size={20} />,
      path: "crear-rutina",
      component: CrearRutinaContent,
    },
    {
      label: "Clientes Asignados",
      icon: <UserCheck size={20} />,
      path: "clientes",
      component: () => {
        if (!usuario?.id_usuario)
          return <div className="p-10 text-red-600">Error: entrenador no definido</div>;
        return <ClientsTrainerDashboard idEntrenador={usuario.id_usuario} />;
      },
    },
    {
      label: "Profesores",
      icon: <School2 size={20} />,
      path: "profesores",
      component: ProfesoresContent,
    },
  ];

  const [selectedItem, setSelectedItem] = useState<SidebarItem>(sidebarItems[0]);

  return (
    <div className="flex h-screen overflow-hidden">
      <TrainerSidebar
        items={sidebarItems}
        activeItemPath={selectedItem.path}
        onSelectItem={setSelectedItem}
        trainerName={`${usuario?.primer_nombre ?? ""} ${usuario?.primer_apellido ?? ""}`}
        trainerEmail={usuario?.correo ?? ""}
      />
      <main className="flex-1 flex flex-col bg-[#f5f5f5] overflow-auto">
        <header className="px-12 py-6 bg-white shadow-md sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedItem.label === "Inicio"
              ? "Bienvenido, Entrenador"
              : `Sección de ${selectedItem.label}`}
          </h1>
        </header>
        {/* Render dinámico con protección de error */}
        {(() => {
          try {
            // Permite tanto componentes FC como funciones
            const Comp = selectedItem.component;
            return <Comp />;
          } catch (e) {
            return (
              <div className="p-10 text-red-500">
                Error al cargar la sección: {e instanceof Error ? e.message : String(e)}
              </div>
            );
          }
        })()}
      </main>
    </div>
  );
};

export default TrainerDashboard;
