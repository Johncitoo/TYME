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
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  // 1) Carga inicial y recarga al cambiar search o limit
  useEffect(() => {
    setCargando(true);
    getAllRutinas()
      .then(data => {
        // opcionalmente filtras por search/limit aquí
        setRutinas(data);
      })
      .catch(() => {
        setError('No se pudieron cargar las rutinas');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [search, limit]);

  // 2) Manejador de borrado
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta rutina?')) return;
    try {
      await deleteRutina(id);
      setRutinas(r => r.filter(x => x.id_rutina !== id));
    } catch {
      alert('Error al eliminar la rutina');
    }
  };

  if (cargando) return <div className="p-8">Cargando rutinas…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">Rutinas</h1>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/admin/rutinas/crear')}
          >
            Crear rutina
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label>Mostrar</label>
              <select
                className="border px-2 py-1 rounded"
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
              >
                {[10,20,50].map(n => (
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
                className="border px-3 py-1 rounded flex-1"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button onClick={() => {/* trigger useEffect */}}>
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Fecha inicio</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rutinas.map(r => (
                <tr key={r.id_rutina}>
                  <td className="px-6 py-4">{r.nombre}</td>
                  <td className="px-6 py-4">{r.descripcion || '–'}</td>
                  <td className="px-6 py-4">
                    {new Date(r.fecha_inicio).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/rutinas/editar/${r.id_rutina}`)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(
                          `/admin/rutinas/${r.id_rutina}/ejercicios`
                        )
                      }
                    >
                      Ver ejercicios
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
        {/* aquí podrías añadir paginación */}
      </main>
    </div>
  );
}

