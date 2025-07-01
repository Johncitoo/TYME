import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import {
  getPagos,
  getResumenPagos
} from '@/services/pagos.service';
import type { Pago, ResumenPagos } from '@/services/pagos.service';

export default function PagosPage() {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [resumen, setResumen] = useState<ResumenPagos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

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

  if (loading) return <div>Cargando pagos…</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
      <SidebarAdmin/>
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Pagos</h1>
          <button
            onClick={() => navigate('/admin/pagos/crear')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar Pago
          </button>
        </div>

        {/* Resumen general */}
        {resumen && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Ventas Totales</h2>
              <p className="text-2xl">${resumen.ventas_totales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Pagos Realizados</h2>
              <p className="text-2xl">{resumen.pagos_totales}</p>
            </div>
          </div>
        )}

        {/* Desglose por mes y por método */}
        {resumen && (
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Ventas por mes</h3>
              <ul className="list-disc list-inside">
                {resumen.ventas_por_mes.map(v => (
                  <li key={v.mes}>
                    {v.mes}: ${v.total.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Ventas por método</h3>
              <ul className="list-disc list-inside">
                {resumen.ventas_por_metodo.map(v => (
                  <li key={v.metodo}>
                    {v.metodo}: ${v.total.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabla de pagos */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Monto</th>
                <th className="px-6 py-3 text-left">Método</th>
                <th className="px-6 py-3 text-left">Cliente ID</th>
                <th className="px-6 py-3 text-left">Membresía ID</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pagos.map(p => (
                <tr key={p.id_boleta}>
                  <td className="px-6 py-4">
                    {new Date(p.fecha_pago).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    ${p.monto.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {p.metodo_pago}
                  </td>
                  <td className="px-6 py-4">{p.id_cliente}</td>
                  <td className="px-6 py-4">{p.id_membresia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


