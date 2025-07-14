// src/pages/EditExercisePage.tsx
import React, { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SidebarAdmin from '@/components/AdminSidebar'
import {
  getAllGrupoMuscular,
  getAllTipoEjercicio,
  getEjercicioById,
  updateEjercicio,
} from '@/services/ejercicio.service'

interface Option { id: number; nombre: string }

interface FormState {
  nombre: string
  descripcion: string
  video_url: string
  imagen_url: string
  id_grupo_muscular: string
  id_tipo_ejercicio: string
}

export default function EditExercisePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    nombre: '',
    descripcion: '',
    video_url: '',
    imagen_url: '',
    id_grupo_muscular: '',
    id_tipo_ejercicio: '',
  })
  const [grupoList, setGrupoList] = useState<Option[]>([])
  const [tipoList, setTipoList] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1) Cargo los catálogos
  useEffect(() => {
    Promise.all([getAllGrupoMuscular(), getAllTipoEjercicio()])
      .then(([grupos, tipos]) => {
        setGrupoList(grupos)
        setTipoList(tipos)
      })
      .catch(() => {
        setError('No se pudieron cargar grupos o tipos')
      })
  }, [])

  // 2) Cuando tengo los catálogos, traigo el ejercicio y relleno el form
  useEffect(() => {
    if (!grupoList.length || !tipoList.length) return

    getEjercicioById(Number(id))
      .then((data: {
        nombre: string
        descripcion?: string
        video_url?: string
        imagen_url?: string
        grupoMuscular: { id_grupo_muscular: number }
        tipoEjercicio: { id_tipo_ejercicio: number }
      }) => {
        setForm({
          nombre:            data.nombre,
          descripcion:       data.descripcion  ?? '',
          video_url:         data.video_url    ?? '',
          imagen_url:        data.imagen_url   ?? '',
          id_grupo_muscular: String(data.grupoMuscular.id_grupo_muscular),
          id_tipo_ejercicio: String(data.tipoEjercicio.id_tipo_ejercicio),
        })
      })
      .catch(() => {
        setError('No se pudo cargar el ejercicio')
      })
      .finally(() => setLoading(false))
  }, [id, grupoList, tipoList])

  if (loading) return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 flex items-center justify-center">Cargando…</div>
    </div>
  )
  if (error) return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
    </div>
  )

  // 3) Al enviar, actualizo con updateEjercicio
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateEjercicio(Number(id), {
      nombre:             form.nombre,
      descripcion:        form.descripcion,
      video_url:          form.video_url,
      imagen_url:         form.imagen_url,
      id_grupo_muscular:  Number(form.id_grupo_muscular),
      id_tipo_ejercicio:  Number(form.id_tipo_ejercicio),
    })
      .then(() => navigate('/admin/ejercicios'))
      .catch(() => setError('Error al guardar los cambios'))
  }

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Editar ejercicio</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          {/* Nombre */}
          <div>
            <label>Nombre</label>
            <input
              className="w-full border px-2 py-1 rounded"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>

          {/* Descripción */}
          <div>
            <label>Descripción</label>
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
          </div>

          {/* Video / Imagen URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Video URL</label>
              <input
                className="w-full border px-2 py-1 rounded"
                value={form.video_url}
                onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
              />
            </div>
            <div>
              <label>Imagen URL</label>
              <input
                className="w-full border px-2 py-1 rounded"
                value={form.imagen_url}
                onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))}
              />
            </div>
          </div>

          {/* Grupo muscular */}
          <div>
            <label>Grupo muscular</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.id_grupo_muscular}
              onChange={e => setForm(f => ({ ...f, id_grupo_muscular: e.target.value }))}
            >
              <option value="">Selecciona uno…</option>
              {grupoList.map(g => (
                <option key={g.id} value={String(g.id)}>{g.nombre}</option>
              ))}
            </select>
          </div>

          {/* Tipo de ejercicio */}
          <div>
            <label>Tipo de ejercicio</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.id_tipo_ejercicio}
              onChange={e => setForm(f => ({ ...f, id_tipo_ejercicio: e.target.value }))}
            >
              <option value="">Selecciona uno…</option>
              {tipoList.map(t => (
                <option key={t.id} value={String(t.id)}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded">
            Guardar cambios
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </main>
    </div>
  )
}





