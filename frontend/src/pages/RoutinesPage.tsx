import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar'; // o tu layout
import { Search } from 'lucide-react';

interface Rutina {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string; // o Date
  // cualquier otro campo que retorne tu API
}

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`http://localhost:3000/rutinas?search=${encodeURIComponent(search)}&limit=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
        // Agrega el Bearer token aquí
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
)
      .then(res => {
        if (!res.ok) throw new Error('Error cargando rutinas');
        return res.json();
      })
      .then(data => {
        setRutinas(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar las rutinas');
        setCargando(false);
      });
  }, [search, limit]);

  if (cargando) return <div>Cargando rutinas…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">Rutinas</h1>
          <div className="space-x-2">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => navigate('/admin/rutinas/crear')}
            >
              Crear rutina
            </button>
          </div>
        </div>

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
                  <option key={n} value={n}>{n}</option>
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
              <button onClick={() => {/* el efecto fetch se dispara por dependencia */}}>
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Fecha inicio</th>
                <th className="px-6 py-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rutinas.map(r => (
                <tr key={r.id_rutina}>
                  <td className="px-6 py-4">{r.nombre}</td>
                  <td className="px-6 py-4">{r.descripcion || '–'}</td>
                  <td className="px-6 py-4">{new Date(r.fecha_inicio).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/admin/rutinas/editar/${r.id_rutina}`)}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => navigate(`/admin/rutinas/${r.id_rutina}/ejercicios`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Ver ejercicios
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginar si quieres… */}
      </main>
    </div>
  );
}
