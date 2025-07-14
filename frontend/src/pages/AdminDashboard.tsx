import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Search } from 'lucide-react';
import SidebarAdmin from '@/components/AdminSidebar';
import { getPagos } from '@/services/pagos.service';
import type { Pago } from '@/services/pagos.service';

const AdminDashboard: FC = () => {
  const [search, setSearch] = useState<string>('');
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    getPagos()
      .then(setPagos)
      .catch(() => console.error('Error al cargar pagos'));
  }, []);

  const filteredPagos = pagos.filter(p =>
    String(p.metodo_pago).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#1c1e26] text-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#2b2d3c] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Profesores</h3>
            <ul className="space-y-1 text-gray-300">
              <li>• Juan Dela Cruz</li>
              <li>• Peter</li>
              <li>• Maria</li>
            </ul>
          </div>

          <div className="bg-[#2b2d3c] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Ventas Mensuales</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-gray-700"
                    strokeWidth="3"
                    strokeDasharray="100,100"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                  />
                  <path
                    className="text-cyan-400"
                    strokeWidth="3"
                    strokeDasharray="84,100"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-cyan-300">
                  84%
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Últimos pagos</h4>
              <ul className="text-sm text-gray-300 space-y-1 max-h-24 overflow-y-auto">
                {pagos
                  .slice()
                  .sort((a, b) => b.fecha_pago.localeCompare(a.fecha_pago))
                  .slice(0, 3)
                  .map(p => (
                    <li key={p.id_boleta} className="flex justify-between">
                      <span>Cliente #{p.id_cliente}</span>
                      <span className="text-gray-400">{p.fecha_pago}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#2b2d3c] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">Miembros Activos</h3>
            <p className="text-3xl font-bold text-cyan-400">
              {new Set(pagos.map(p => p.id_cliente)).size}
            </p>
          </div>
        </div>

        <div className="bg-[#2b2d3c] p-6 rounded-2xl shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Buscar método"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#1f212d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="text-sm text-gray-300">
              <label>Ordenar por:</label>
              <select className="ml-2 border border-gray-600 bg-[#1f212d] text-white rounded-lg p-1 text-sm">
                <option>Fecha</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-600 text-gray-200">
                  <th className="py-2 px-2">Fecha</th>
                  <th className="py-2 px-2">Monto</th>
                  <th className="py-2 px-2">Método</th>
                  <th className="py-2 px-2">Cliente</th>
                  <th className="py-2 px-2">Membresía</th>
                </tr>
              </thead>
              <tbody>
                {filteredPagos.map(p => (
                  <tr key={p.id_boleta} className="hover:bg-[#3a3d4f]">
                    <td className="py-2 px-2">{new Date(p.fecha_pago).toLocaleDateString()}</td>
                    <td className="py-2 px-2">${p.monto.toLocaleString()}</td>
                    <td className="py-2 px-2">{p.metodo_pago}</td>
                    <td className="py-2 px-2">{p.id_cliente}</td>
                    <td className="py-2 px-2">{p.id_membresia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
