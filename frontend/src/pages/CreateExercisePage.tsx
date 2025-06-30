// src/pages/CreateExercisePage.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { getAllGrupoMuscular, getAllTipoEjercicio, createEjercicio } from '@/services/ejercicio.service';

interface Option { id: number; nombre: string }

export default function CreateExercisePage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [grupoList, setGrupoList] = useState<Option[]>([]);
  const [tipoList, setTipoList] = useState<Option[]>([]);
  const [selGrupo, setSelGrupo] = useState<number>();
  const [selTipo, setSelTipo] = useState<number>();
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getAllGrupoMuscular(),
      getAllTipoEjercicio()
    ]).then(([grupos, tipos]) => {
      setGrupoList(grupos);
      setTipoList(tipos);
    }).catch(() => setError('No se pudieron cargar las listas de selección'));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selGrupo || !selTipo) {
      setError('Debes elegir grupo y tipo');
      return;
    }
    createEjercicio({
      nombre,
      descripcion,
      video_url: videoUrl,
      imagen_url: imagenUrl,
      id_grupo_muscular: selGrupo,
      id_tipo_ejercicio: selTipo,
    })
    .then(() => navigate('/admin/ejercicios'))
    .catch(() => setError('Error creando el ejercicio'));
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin />

      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Crear ejercicio</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label>Nombre</label>
            <input
              className="w-full border p-2 rounded"
              value={nombre} onChange={e => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea
              className="w-full border p-2 rounded"
              value={descripcion} onChange={e => setDescripcion(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label>Video URL</label>
              <input
                className="w-full border p-2 rounded"
                value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label>Imagen URL</label>
              <input
                className="w-full border p-2 rounded"
                value={imagenUrl} onChange={e => setImagenUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label>Grupo muscular</label>
              <select
                className="w-full border p-2 rounded"
                value={selGrupo}
                onChange={e => setSelGrupo(Number(e.target.value))}
              >
                <option value="">Selecciona uno...</option>
                {grupoList.map(g =>
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                )}
              </select>
            </div>
            <div className="flex-1">
              <label>Tipo de ejercicio</label>
              <select
                className="w-full border p-2 rounded"
                value={selTipo}
                onChange={e => setSelTipo(Number(e.target.value))}
              >
                <option value="">Selecciona uno...</option>
                {tipoList.map(t =>
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                )}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
          >
            Guardar ejercicio
          </button>
        </form>
      </main>
    </div>
  );
}

