// src/pages/RoutinesMobile.tsx
import React, { useState, useMemo } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// MOCK: datos de ejemplo (reemplázalos con tu fetch a la API cuando esté listo)
const mockRoutineExercises = [
  { id: 1, nombre: "Press banca",       imagen: "/images/press_banca.jpg",    series: 3, repeticiones: 12, peso: 60, dia: 1, orden: 1 },
  { id: 2, nombre: "Purple Cauliflower",imagen: "/images/purple_cauliflower.jpg", series: 3, repeticiones: 12, peso: 50, dia: 1, orden: 2 },
  { id: 3, nombre: "Savoy Cabbage",     imagen: "/images/savoy_cabbage.jpg",   series: 3, repeticiones: 12, peso: 80, dia: 1, orden: 3 },
  { id: 4, nombre: "Curl bíceps",       imagen: "/images/curl_biceps.jpg",    series: 4, repeticiones: 10, peso: 20, dia: 2, orden: 1 },
  // … más ejercicios
];

export default function RoutinesMobile() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);

  // Extrae días únicos
  const days = useMemo(
    () => Array.from(new Set(mockRoutineExercises.map((e) => e.dia))).sort(),
    []
  );

  // Filtra por día, búsqueda y orden
  const filtered = useMemo(() => {
    return mockRoutineExercises
      .filter((e) => e.dia === selectedDay)
      .filter((e) => e.nombre.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.orden - b.orden);
  }, [search, selectedDay]);

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-cyan-400 ml-2">Rutina</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ejercicio"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Selector de Día */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(+e.target.value)}
          className="px-4 py-2 bg-cyan-200 rounded-full text-cyan-800 font-medium
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {days.map((d) => (
            <option key={d} value={d}>
              Día {d}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Ejercicios */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((ex) => (
            <div
              key={ex.id}
              className="flex bg-cyan-200 rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={ex.imagen}
                alt={ex.nombre}
                className="w-24 h-24 object-cover"
              />
              <div className="p-3 flex-1">
                <h2 className="text-lg font-bold text-cyan-800">{ex.nombre}</h2>
                <p className="text-gray-700">{ex.series} Series</p>
                <p className="text-gray-700">{ex.repeticiones} Repeticiones</p>
                <p className="text-gray-700">{ex.peso} Kilos</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay ejercicios para este día.</p>
        )}
      </div>
    </div>
  );
}
