import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/AdminSidebar';
import { Search, Trash2 } from 'lucide-react';

interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
  tipoEjercicio: { id_tipo_ejercicio: number; nombre: string };
  grupoMuscular: { id_grupo_muscular: number; nombre: string };
  estado: string;
}

export default function EjerciciosPage() {
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:3000'; // o tu constante de entorno

  const fetchList = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/ejercicios?search=${encodeURIComponent(search)}&limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setEjercicios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar los ejercicios.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, [search, limit]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ejercicio?')) return;
    try {
      const res = await fetch(`${API_BASE}/ejercicios/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      setEjercicios(prev => prev.filter(e => e.id_ejercicio !== id));
    } catch {
      alert('Error al eliminar el ejercicio');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-600">Cargando ejercicios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto bg-[#f4f4f6] p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-500">Ejercicios</h1>
          <div className="flex gap-2">
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full shadow transition"
              onClick={() => navigate('/admin/ejercicios/crear')}
            >
              Crear ejercicio
            </button>
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full shadow transition"
              onClick={() => navigate('/admin/rutinas')}
            >
              Ver rutinas
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label className="font-medium">Mostrar</label>
              <select
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className="px-2 py-1 border rounded-md focus:outline-none"
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
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-md transition"
                onClick={fetchList}
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de ejercicios */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Grupo muscular</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ejercicios.map(ej => (
                <tr key={ej.id_ejercicio} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{ej.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ej.tipoEjercicio.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ej.grupoMuscular.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ej.estado || 'Activo'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm transition"
                      onClick={() => navigate(`/admin/ejercicios/${ej.id_ejercicio}/editar`)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition"
                      onClick={() => handleDelete(ej.id_ejercicio)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación simple */}
        <div className="flex justify-end mt-6 space-x-4">
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">Anterior</button>
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">Siguiente</button>
        </div>
      </main>
    </div>
  );
}


