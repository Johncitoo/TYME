import React from 'react';
import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';

interface Exercise {
  id: number;
  name: string;
  image: string;
  series: number;
  reps: number;
  weight: number;
}

const dummyExercises: Exercise[] = [
  { id: 1, name: 'Press banca', image: '/img/press-banca.png', series: 3, reps: 12, weight: 60 },
  { id: 2, name: 'Press Militar', image: '/img/purple-cauliflower.png', series: 3, reps: 12, weight: 50 },
  { id: 3, name: 'Peso Muerto', image: '/img/savoy-cabbage.png', series: 3, reps: 12, weight: 80 },
];

const days = ['Dia 1', 'Dia 2', 'Dia 3'];

const RoutinesPage: FC = () => {
  const [search, setSearch] = useState('');
  const [day, setDay] = useState(days[0]);

  const filtered = dummyExercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col md:flex-row">
      {/* Left panel: controls */}
      <div className="md:w-1/3 w-full pr-4 mb-6 md:mb-0">
        <h1 className="text-4xl font-bold text-primary mb-6">Rutina</h1>
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.5a7.5 7.5 0 010 14.15z" />
            </svg>
          </div>

          {/* Day selector */}
          <select
            value={day}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setDay(e.target.value)}
            className="px-4 py-2 bg-primary text-white rounded-full focus:outline-none"
          >
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right panel: exercise cards */}
      <div className="md:w-2/3 w-full grid gap-6">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="flex flex-col md:flex-row items-center bg-primary text-white rounded-xl p-6 gap-6"
          >
            <img
              src={ex.image}
              alt={ex.name}
              className="w-full md:w-40 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">{ex.name}</h2>
              <p className="text-sm">{ex.series} Series</p>
              <p className="text-sm">{ex.reps} Repeticiones</p>
              <p className="text-sm">{ex.weight} Kilos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutinesPage;
