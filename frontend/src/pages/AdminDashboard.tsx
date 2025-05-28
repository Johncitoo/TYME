import React, { useState } from "react";
import type { FC } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Search,
  Bell,
  LogOut,
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
import CreateUser from "../pages/CreateUser";

interface Member {
  id: number;
  name: string;
  datePaid: string;
  dateExpiry: string;
  status: "Active" | "Pending" | "Expired";
}

const dummyMembers: Member[] = [
  { id: 1, name: "Elmer Luzo", datePaid: "2025-05-14", dateExpiry: "2025-06-14", status: "Active" },
  { id: 2, name: "Ronnie Coleman", datePaid: "2025-04-10", dateExpiry: "2025-05-10", status: "Pending" },
  { id: 3, name: "McLovin", datePaid: "2025-04-01", dateExpiry: "2025-05-01", status: "Expired" },
];

const AdminDashboard: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredMembers = dummyMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-full p-2 mb-2">
              <Users className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Administrator Name</h2>
            <p className="text-sm opacity-80">admin@example.com</p>
          </div>
          <nav className="space-y-4">
            <NavLink
              to="/home"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <AppWindow /> Inicio
            </NavLink>

            <NavLink
              to="/admin/profile"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <Home /> Administrador
            </NavLink>

            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <NotebookPen /> Registrar Usuarios
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <Bell /> Ejercicios y rutina
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <FolderKanban /> Plan
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <BadgeDollarSign /> Pagos
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <Users /> Usuarios
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <School2 /> Profesores
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-90">
              <ClipboardPlus /> Reportes
            </a>
          </nav>
        </div>
        <button
          className="flex items-center gap-2 text-white hover:opacity-90"
          onClick={() => {/* opcional logout */}}
        >
          <LogOut /> Desconectarse
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-[#ECE9E9] overflow-y-auto">
        <header className="flex justify-between items-center px-8 py-6">
          <h1 className="text-4xl font-bold">Bienvenido, Administrador</h1>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
            onClick={() => setShowModal(true)}
          >
            Create User
          </button>
        </header>

        <section className="px-8 space-y-6">
          {/* Cards row */}
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
          <div className="flex flex-col lg:flex-row lg:space-x-6 gap-6">
            {/* Calendar */}
            <div className="bg-white p-6 rounded-lg shadow flex-1">
              <DayPicker
                mode="single"
                required
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="!border-0"
              />
            </div>

            {/* Active members */}
            <div className="bg-white p-6 rounded-lg shadow flex-1">
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

        {/* Modal overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Crear Usuario</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
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


