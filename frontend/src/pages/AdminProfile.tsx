import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SidebarAdmin from '@/components/AdminSidebar';

interface Profile {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre: string;
  correo: string;
  telefono: string;
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);

  const [form, setForm] = useState<Profile>({
    id_usuario: usuario?.id_usuario ?? 0,
    primer_nombre: '',
    segundo_nombre: '',
    correo: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3000/admin/profile/${usuario.id_usuario}`, {
      headers: { Authorization: `Bearer ${usuario.token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: Profile) => setForm(data))
      .catch(() => setError('No se pudieron cargar los datos'))
      .finally(() => setLoading(false));
  }, [usuario, navigate]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setError('');
    fetch(`http://localhost:3000/admin/profile/${usuario.id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${usuario.token}`,
      },
      body: JSON.stringify({
        primer_nombre: form.primer_nombre,
        segundo_nombre: form.segundo_nombre,
        correo: form.correo,
        telefono: form.telefono,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => navigate('/admin'))
      .catch(() => setError('Error al guardar los cambios'));
  };

  if (loading) return <p className="p-6 text-white">Cargando…</p>;

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white">
      <SidebarAdmin />
      <main className="flex-1 p-8 md:p-10 overflow-y-auto flex items-center justify-center">
        <div className="bg-[#2b2b3d] rounded-xl shadow-xl w-full max-w-5xl p-8 flex flex-col md:flex-row gap-8">
          {/* Info Card */}
          <div className="md:w-1/2 border-r border-gray-600 pr-6">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-cyan-500 rounded-full p-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-cyan-400">{form.primer_nombre} {form.segundo_nombre}</h3>
              <p className="text-sm text-gray-400 mt-1">{form.correo}</p>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <p><span className="text-cyan-400">Nombre:</span> {form.primer_nombre}</p>
              <p><span className="text-cyan-400">Segundo Nombre:</span> {form.segundo_nombre}</p>
              <p><span className="text-cyan-400">Correo:</span> {form.correo}</p>
              <p><span className="text-cyan-400">Teléfono:</span> {form.telefono}</p>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={onSubmit} className="md:w-1/2">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Editar Perfil</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-300">Primer Nombre</span>
                <input
                  name="primer_nombre"
                  value={form.primer_nombre}
                  onChange={onChange}
                  className="w-full bg-gray-800 text-white p-2 mt-1 rounded border border-gray-600 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Segundo Nombre</span>
                <input
                  name="segundo_nombre"
                  value={form.segundo_nombre}
                  onChange={onChange}
                  className="w-full bg-gray-800 text-white p-2 mt-1 rounded border border-gray-600 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Correo Electrónico</span>
                <input
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={onChange}
                  className="w-full bg-gray-800 text-white p-2 mt-1 rounded border border-gray-600 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-300">Teléfono</span>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={onChange}
                  className="w-full bg-gray-800 text-white p-2 mt-1 rounded border border-gray-600 focus:outline-none"
                />
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded font-semibold"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 border border-gray-400 hover:bg-gray-800 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}









