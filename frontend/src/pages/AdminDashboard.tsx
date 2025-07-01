
import React, { useState } from 'react';
import type { FC } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import SidebarAdmin from '@/components/AdminSidebar';

interface Member {
  id: number;
  name: string;
  datePaid: string;
  dateExpiry: string;
  status: string;
}


const dummyMembers: Member[] = [
  { id: 1, name: 'James Medalla', datePaid: '2025-06-01', dateExpiry: '2025-07-01', status: 'Activo' },
  { id: 2, name: 'Kent Charl Mabutus', datePaid: '2025-06-05', dateExpiry: '2025-07-05', status: 'Activo' },
  { id: 3, name: 'John Elmar Rodrigo', datePaid: '2025-06-10', dateExpiry: '2025-07-10', status: 'Activo' },
];

const AdminDashboard: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [search, setSearch] = useState('');
  const filtered = dummyMembers.filter(m =>

    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {/* Header cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Profesores</h3>
            <ul className="space-y-1">
              <li>• Juan Dela Cruz</li>
              <li>• Peter</li>
              <li>• Maria</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">Ventas Mensuales</h3>
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path className="text-gray-200" strokeWidth="3" strokeDasharray="100,100" stroke="currentColor" fill="none" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831" />
                <path className="text-purple-600" strokeWidth="3" strokeDasharray="84,100" stroke="currentColor" fill="none" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">84%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Miembros Activos</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>



        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar panel */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <button><ArrowLeft /></button>
              <span className="font-medium">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button><ArrowRight /></button>
            </div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={date => date && setSelectedDate(date)}
              className="!rounded-xl"
            />
          </div>

          {/* Members table */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div>
                <label>Sort by:</label>
                <select className="ml-2 border rounded-lg p-1">
                  <option>Name</option>
                  <option>Date paid</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
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
                  {filtered.map(m => (
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


