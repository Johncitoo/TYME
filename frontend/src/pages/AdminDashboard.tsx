import React, { useState } from "react";
import type { FC } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Search,
  Bell,
  Home,
  Users,
  Calendar as AppWindow,
  NotebookPen,
  FolderKanban,
  BadgeDollarSign,
  School2,
  ClipboardPlus
} from "lucide-react";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import CreateUser from "../pages/CreateUser";
import SidebarAdmin from "@/components/AdminSidebar";

const HomeContent: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState("");

  const dummyMembers = [
    { id: 1, name: "Elmer Luzoooo", datePaid: "2025-05-14", dateExpiry: "2025-06-14", status: "Active" },
    { id: 2, name: "Ronnie Coleman", datePaid: "2025-04-10", dateExpiry: "2025-05-10", status: "Pending" },
    { id: 3, name: "McLovin", datePaid: "2025-04-01", dateExpiry: "2025-05-01", status: "Expired" },
  ];

  const filteredMembers = dummyMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="p-10 space-y-6 flex-1 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Usuarios", desc: "Gestiona todos los usuarios del gimnasio." },
          { title: "Rutinas", desc: "Gestiona las rutinas asignadas a los clientes." },
          { title: "Pagos", desc: "Gestiona los pagos y su estado." },
        ].map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Calendar and members */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 gap-6 flex-1">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow flex-1">
          <DayPicker
            mode="single"
            required
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            className="!border-0"
          />
        </div>

        {/* Active members */}
        <div className="bg-white p-5 rounded-lg shadow flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="name">Sort by Name</option>
              <option value="datePaid">Date paid</option>
              <option value="dateExpiry">Date expiry</option>
            </select>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Member</th>
                <th className="py-2">Date Paid</th>
                <th className="py-2">Expires</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-gray-100">
                  <td className="py-2">{m.name}</td>
                  <td className="py-2">{m.datePaid}</td>
                  <td className="py-2">{m.dateExpiry}</td>
                  <td className="py-2">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// Componente para la sección de Profesores
const ProfesoresContent: FC = () => (
  <div className="flex-1 flex flex-col w-full">
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-[#59427D] text-white p-6 rounded-lg shadow-lg flex-1 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Profesores</h2>
        <button className="bg-white text-primary px-4 py-2 rounded-md mb-6 hover:bg-gray-100">
          Agregar profesor
        </button>

      {/* Contenido de la tabla de profesores */}
        <div className="bg-[#4E3A6E] p-4 rounded-lg flex-1 flex flex-col w-full">
          {" "}
          <div className="flex justify-between items-center mb-4">
            <label className="text-white">
              Show Entities
              <select className="ml-2 bg-white text-gray-800 rounded px-2 py-1">
                <option>10</option>
                <option>20</option>
              </select>
            </label>
            <div className="relative flex-1 max-w-sm ml-4"> 
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary w-full" // Añadir w-full
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full text-left text-white">
              {" "}
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2">Nombre</th>
                  <th className="py-2">RUT</th>
                  <th className="py-2">Contacto</th>
                  <th className="py-2">Correo</th>
                  <th className="py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Coach 1", rut: "SFM230IN1", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 2", rut: "SFM230IN2", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 3", rut: "SFM230IN3", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 4", rut: "SFM230IN4", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 5", rut: "SFM230IN5", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 6", rut: "SFM230IN6", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 7", rut: "SFM230IN7", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 8", rut: "SFM230IN8", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 9", rut: "SFM230IN9", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 10", rut: "SFM230IN10", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 11", rut: "SFM230IN11", contact: "Jan 11", email: "Feb 11" },
                  { name: "Coach 12", rut: "SFM230IN12", contact: "Jan 11", email: "Feb 11" },
                ].map((profesor, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-[#6A538D]"
                  >
                    <td className="py-2">{profesor.name}</td>
                    <td className="py-2">{profesor.rut}</td>
                    <td className="py-2">{profesor.contact}</td>
                    <td className="py-2">{profesor.email}</td>
                    <td className="py-2">
                      <button className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-200">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm">
            <button className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100">
              Anterior
            </button>
            <button className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100">
              Siguiente
            </button>
          </div>
        </div>
      </div>
      <div className="p-8 pt-0"> 
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h3 className="text-gray-700 text-sm">Miembros en el gimnasio</h3>
          <p className="text-4xl font-bold text-gray-900">12</p>
        </div>
      </div>
    </div>
     </div>
);



// --- Componente para Reportes
const ReportesContent: FC = () => (

  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-[#F0E68C] p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Reportes</h2>
      <p>Contenido para la sección de Reportes.</p>
      <div className="mt-4 p-4 border border-dashed border-gray-400 h-full flex items-center justify-center text-gray-600">
        Este es un bloque de contenido que se estira para ocupar el espacio restante.
      </div>
    </div>
  </div>
);


const AdministradorContent: FC = () => (
  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-white p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Administrador</h2>
      <p>Contenido para la sección de Administrador.</p>
    </div>
  </div>
);


interface AsistenciaPorFecha {
  fecha: string; //"2024-05-20"
  presente: boolean;
}

interface Alumno {
  id: number;
  nombre: string;
  asistencia: AsistenciaPorFecha[]; 
}

const RegistrarAsistenciaContent: FC = () => {
  const fechasDeAsistencia = ['2024-05-20', '2024-05-21', '2024-05-22', '2024-05-23', '2024-05-24', '2024-05-25', '2024-05-26', '2024-05-27'];

  const [alumnos, setAlumnos] = useState<Alumno[]>([
    {
      id: 1,
      nombre: 'Juan Pérez',
      asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })),
    },
    {
      id: 2,
      nombre: 'María García',
      asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })),
    },
    {
      id: 3,
      nombre: 'Carlos Ruiz',
      asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })),
    },
    {
      id: 4,
      nombre: 'Ana López',
      asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })),
    },
  ]);


  const handleCheckboxChange = (alumnoId: number, fecha: string) => {
    setAlumnos(prevAlumnos =>
      prevAlumnos.map(alumno => {
        if (alumno.id === alumnoId) {
          return {
            ...alumno,
            asistencia: alumno.asistencia.map(item =>
              item.fecha === fecha ? { ...item, presente: !item.presente } : item
            ),
          };
        }
        return alumno;
      })
    );
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-green-50 p-6 rounded-lg shadow flex-1">
        <h2 className="text-2xl font-semibold text-green-800 mb-6">Registrar Asistencia por Fecha</h2>

        <div className="flex items-center justify-between p-2 mb-2 bg-green-100 rounded-md shadow-sm">
          <div className="w-48 text-left font-bold text-green-800">Alumno</div>
          <div className="flex flex-grow justify-around">
            {fechasDeAsistencia.map(fecha => (
              <span key={fecha} className="text-sm font-bold text-green-700 w-24 text-center">
                {new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>

        <ul className="space-y-3">
          {alumnos.map(alumno => (
            <li
              key={alumno.id}
              className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-white shadow-sm"
            >
              <div className="w-48 text-left font-medium text-gray-800">
                {alumno.nombre}
              </div>

              <div className="flex flex-grow justify-around items-center">
                {fechasDeAsistencia.map(fecha => {
                  const asistenciaDelDia = alumno.asistencia.find(item => item.fecha === fecha);
                  return (
                    <div key={fecha} className="w-24 flex justify-center">
                      <input
                        type="checkbox"
                        checked={asistenciaDelDia?.presente || false}
                        onChange={() => handleCheckboxChange(alumno.id, fecha)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded-md cursor-pointer focus:ring-green-500"
                      />
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const EjerciciosRutinaContent: FC = () => (
  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-purple-50 p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Ejercicios y Rutina</h2>
      <p>Contenido para la sección de Ejercicios y Rutina.</p>
    </div>
  </div>
);

const PlanContent: FC = () => {
  const [planData, setPlanData] = useState({
    nombreDelPlan: '',
    durabilidad: '',
    cantidadAlumnos: '',
    fechaInicio: '', 
    fechaTermino: '',
    descripcion: '',
    precio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del plan enviados:', planData);
    alert('Plan guardado (ver consola para los datos)');
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-blue-300 p-6 rounded-lg shadow flex-1">
        <h2 className="text-2xl font-bold mb-6 text-white">Crear Nuevo Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombreDelPlan" className="block text-white text-lg font-medium mb-1">
                Nombre del plan
              </label>
              <input
                type="text"
                id="nombreDelPlan"
                name="nombreDelPlan"
                value={planData.nombreDelPlan}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label htmlFor="durabilidad" className="block text-white text-lg font-medium mb-1">
                  Durabilidad
                </label>
                <input
                  type="text"
                  id="durabilidad"
                  name="durabilidad"
                  value={planData.durabilidad}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="cantidadAlumnos" className="block text-white text-lg font-medium mb-1">
                  Cantidad de alumnos
                </label>
                <input
                  type="number"
                  id="cantidadAlumnos"
                  name="cantidadAlumnos"
                  value={planData.cantidadAlumnos}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label htmlFor="fechaInicio" className="block text-white text-lg font-medium mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={planData.fechaInicio}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="fechaTermino" className="block text-white text-lg font-medium mb-1">
                  Fecha de término
                </label>
                <input
                  type="date"
                  id="fechaTermino"
                  name="fechaTermino"
                  value={planData.fechaTermino}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="descripcion" className="block text-white text-lg font-medium mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={planData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                placeholder=""
              ></textarea>
            </div>
            <div>
              <label htmlFor="precio" className="block text-white text-lg font-medium mb-1">
                Precio
              </label>
              <input
                type="text"
                id="precio"
                name="precio"
                value={planData.precio}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-200 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-400 text-white rounded-md font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => console.log('Cancelado')}
              className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




const PagosContent: FC = () => (
  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-yellow-50 p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Pagos</h2>
      <p>Contenido para la sección de Pagos.</p>
    </div>
  </div>
);

const UsuariosContent: FC = () => (
  <div className="p-8 flex-1 flex flex-col">
    <div className="bg-blue-50 p-6 rounded-lg shadow flex-1">
      <h2 className="text-2xl font-bold mb-4">Sección de Usuarios</h2>
      <p>Contenido para la sección de Usuarios.</p>
    </div>
  </div>
);


interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  bgColorClass: string; 
  component: FC; 
}

const sidebarItems: SidebarItem[] = [
  { label: "Inicio", icon: <AppWindow />, path: "inicio", bgColorClass: "bg-[#ECE9E9]", component: HomeContent },
  { label: "Administrador", icon: <Home />, path: "administrador", bgColorClass: "bg-white", component: AdministradorContent },
  { label: "Registrar Asistencia", icon: <NotebookPen />, path: "registrar-usuarios", bgColorClass: "bg-green-50", component: RegistrarAsistenciaContent },
  { label: "Ejercicios y rutina", icon: <Bell />, path: "ejercicios-rutina", bgColorClass: "bg-purple-50", component: EjerciciosRutinaContent },
  { label: "Plan", icon: <FolderKanban />, path: "plan", bgColorClass: "bg-indigo-50", component: PlanContent },
  { label: "Pagos", icon: <BadgeDollarSign />, path: "pagos", bgColorClass: "bg-yellow-50", component: PagosContent },
  { label: "Usuarios", icon: <Users />, path: "usuarios", bgColorClass: "bg-blue-50", component: UsuariosContent },
  { label: "Profesores", icon: <School2 />, path: "profesores", bgColorClass: "bg-[#DDEBEE]", component: ProfesoresContent },
  { label: "Reportes", icon: <ClipboardPlus />, path: "reportes", bgColorClass: "bg-[#FBE9E7]", component: ReportesContent }, // Color de fondo para Reportes (aproximado de la imagen)
];

const AdminDashboard: FC = () => {
  const [selectedPage, setSelectedPage] = useState<SidebarItem>(sidebarItems[0]);
  const [showModal, setShowModal] = useState(false);

  const handleNavigation = (item: SidebarItem) => {
    setSelectedPage(item);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarAdmin />
      {/* Main content */}
      <main className={`flex-1 flex flex-col ${selectedPage.bgColorClass} overflow-x-auto overflow-y-auto`}>
        <header className="flex justify-between items-center px-15 py-6 bg-white shadow-md z-10 sticky top-0">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedPage.path === "inicio" ? "Bienvenido, Administrador" : `Sección de ${selectedPage.label}`}
          </h1>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
            onClick={() => setShowModal(true)}
          >
            Crear Usuario
          </button>
        </header>

        {/* Contenido dinámico de la página */}
        {React.createElement(selectedPage.component)}

        {/* Modal overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 my-8 overflow-y-auto max-h-[90vh]">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Crear Usuario</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <CreateUser />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


export default AdminDashboard;

