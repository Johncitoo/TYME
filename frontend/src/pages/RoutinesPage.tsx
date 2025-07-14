// frontend/src/pages/RutinasPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { Search } from 'lucide-react';
import {
  getAllRutinas,
  deleteRutina,
} from '@/services/routine.service';

interface Rutina {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string;
}

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    getAllRutinas()
      .then(data => {
        setRutinas(data);
      })
      .catch(() => {
        setError('No se pudieron cargar las rutinas');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [search, limit]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta rutina?')) return;
    try {
      await deleteRutina(id);
      setRutinas(r => r.filter(x => x.id_rutina !== id));
    } catch {
      alert('Error al eliminar la rutina');
    }
  };

  if (cargando) return <div className="p-8 text-white">Cargando rutinas…</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="flex h-screen bg-[#1c1e26] text-white">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">Rutinas</h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => navigate('/admin/rutinas/crear')}
          >
            Crear rutina
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-[#2b2d3c] p-4 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm">Mostrar</label>
              <select
                className="border border-gray-600 bg-[#1f212d] text-white px-2 py-1 rounded"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
              >
                {[10, 20, 50].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="border border-gray-600 bg-[#1f212d] text-white px-3 py-1 rounded"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button>
                <Search size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-[#2b2d3c] rounded-xl shadow">
          <table className="min-w-full">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Fecha inicio</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rutinas.map(r => (
                <tr key={r.id_rutina} className="hover:bg-[#3a3d4f]">
                  <td className="px-6 py-4">{r.nombre}</td>
                  <td className="px-6 py-4">{r.descripcion || '–'}</td>
                  <td className="px-6 py-4">
                    {new Date(r.fecha_inicio).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/rutinas/editar/${r.id_rutina}`)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/rutinas/${r.id_rutina}/ejercicios`)
                      }
                    >
                      Ver ejercicios
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(r.id_rutina)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
