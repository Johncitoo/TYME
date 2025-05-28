import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

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

  if (loading) return <p className="p-8">Cargando…</p>;

  return (
    <div className="flex h-full bg-black text-white">
      {/* Sidebar space placeholder */}
      <div className="w-64"></div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white text-black rounded-lg shadow-lg flex overflow-hidden max-w-4xl w-full">
          {/* Info Card */}
          <div className="w-1/2 p-8 border-r">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{form.primer_nombre} {form.segundo_nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">{form.correo}</p>
            </div>
            <p className="text-gray-700"><strong>Nombre:</strong> {form.primer_nombre}</p>
            <p className="text-gray-700 mt-2"><strong>Segundo Nombre:</strong> {form.segundo_nombre}</p>
            <p className="text-gray-700 mt-2"><strong>Correo:</strong> {form.correo}</p>
            <p className="text-gray-700 mt-2"><strong>Teléfono:</strong> {form.telefono}</p>
          </div>

          {/* Edit Form */}
          <form
            onSubmit={onSubmit}
            className="w-1/2 p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Admin Information</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <label className="block mb-3">
              Username
              <input
                name="primer_nombre"
                value={form.primer_nombre}
                onChange={onChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
            </label>

            <label className="block mb-3">
              Contact No.
              <input
                name="telefono"
                value={form.telefono}
                onChange={onChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
            </label>

            <label className="block mb-3">
              Email Address
              <input
                name="correo"
                type="email"
                value={form.correo}
                onChange={onChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
            </label>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-black text-white p-2 rounded"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 bg-white text-black p-2 rounded border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}








