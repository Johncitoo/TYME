import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import {
  getPagos,
  getResumenPagos
} from '@/services/pagos.service';
import type { Pago, ResumenPagos } from '@/services/pagos.service';
import { ResumenPagosChart } from '@/components/ResumenPagosChart';

export default function PagosPage() {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [resumen, setResumen] = useState<ResumenPagos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPagos(), getResumenPagos()])
      .then(([pagosData, resumenData]) => {
        setPagos(pagosData);
        setResumen(resumenData);
        setLoading(false);
      })
      .catch(() => {
        setError('Error cargando pagos');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white p-6">Cargando pagos…</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-6 md:p-10 bg-[#1e1e2f] text-white overflow-y-auto">
        
        {/* Título principal y botón */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">Resumen de Pagos</h1>
          <button
            onClick={() => navigate('/admin/pagos/crear')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md font-medium"
          >
            Registrar Pago
          </button>
        </div>

        {/* Gráfico */}
        {resumen?.ventas_por_mes && (
          <div className="bg-[#2b2b3d] p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Pagos por Mes</h2>
            <ResumenPagosChart data={resumen.ventas_por_mes} />
          </div>
        )}

        {/* Resumen general */}
        {resumen && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#2b2b3d] p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-cyan-400">Ventas Totales</h2>
              <p className="text-3xl font-bold mt-2">${resumen.ventas_totales.toLocaleString()}</p>
            </div>
            <div className="bg-[#2b2b3d] p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-cyan-400">Pagos Realizados</h2>
              <p className="text-3xl font-bold mt-2">{resumen.pagos_totales}</p>
            </div>
          </div>
        )}

        {/* Desglose por mes y método */}
        {resumen && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#2b2b3d] p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Ventas por mes</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {resumen.ventas_por_mes.map(v => (
                  <li key={v.mes}>
                    <span className="text-white">{v.mes}</span>: ${v.total.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#2b2b3d] p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Ventas por método</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {resumen.ventas_por_metodo.map(v => (
                  <li key={v.metodo}>
                    <span className="text-white">{v.metodo}</span>: ${v.total.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabla de pagos */}
        <div className="overflow-x-auto bg-[#2b2b3d] rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Monto</th>
                <th className="px-6 py-3 text-left">Método</th>
                <th className="px-6 py-3 text-left">Cliente ID</th>
                <th className="px-6 py-3 text-left">Membresía ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-300">
              {pagos.map(p => (
                <tr key={p.id_boleta}>
                  <td className="px-6 py-3">{new Date(p.fecha_pago).toLocaleDateString()}</td>
                  <td className="px-6 py-3">${p.monto.toLocaleString()}</td>
                  <td className="px-6 py-3">{p.metodo_pago}</td>
                  <td className="px-6 py-3">{p.id_cliente}</td>
                  <td className="px-6 py-3">{p.id_membresia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
