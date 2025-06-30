// frontend/src/pages/RutinaDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';

interface Ejercicio {
  id_rutina_ejercicio: number;
  dia: number;
  orden: number;
  series: number;
  peso: string;
  descanso: number;
  observacion?: string;
  ejercicio: {
    id_ejercicio: number;
    nombre: string;
    grupoMuscular: { nombre: string };
    tipoEjercicio: { nombre: string };
    video_url?: string;
    imagen_url?: string;
  };
}

interface Rutina {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string;
  rutinaEjercicios: Ejercicio[];
}

export default function RutinaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/rutinas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Rutina) => {
        setRutina(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar la rutina');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center">
          Cargando rutina…
        </div>
      </div>
    );
  }

  if (error || !rutina) {
    return (
      <div className="flex h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error || 'Rutina no encontrada'}
        </div>
      </div>
    );
  }

  // Agrupar ejercicios por día
  const ejerciciosPorDia = rutina.rutinaEjercicios.reduce<Record<number, Ejercicio[]>>((acc, ej) => {
    (acc[ej.dia] ||= []).push(ej);
    return acc;
  }, {});

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <button 
          className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold">{rutina.nombre}</h1>
        <p className="text-gray-600 mb-2">{rutina.descripcion || '—'}</p>
        <p className="text-sm text-gray-500 mb-6">
          Fecha inicio: {new Date(rutina.fecha_inicio).toLocaleDateString()}
        </p>

        {Object.entries(ejerciciosPorDia).map(([dia, lista]) => (
          <section key={dia} className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Día {dia}</h2>
            <div className="space-y-4">
              {lista
                .sort((a, b) => a.orden - b.orden)
                .map(ej => (
                  <div
                    key={ej.id_rutina_ejercicio}
                    className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-medium">{ej.ejercicio.nombre}</h3>
                      <p className="text-sm">
                        <strong>Series:</strong> {ej.series} &nbsp;
                        <strong>Peso:</strong> {ej.peso} kg &nbsp;
                        <strong>Descanso:</strong> {ej.descanso}s
                      </p>
                      {ej.observacion && (
                        <p className="mt-1 text-gray-700">
                          <em>Obs.:</em> {ej.observacion}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-600">
                        {ej.ejercicio.grupoMuscular.nombre} · {ej.ejercicio.tipoEjercicio.nombre}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                      {/* Botón para ir a la página de edición del ejercicio */}
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => navigate(`/admin/ejercicios/${ej.ejercicio.id_ejercicio}/editar`)}
                      >
                        Ver ejercicio
                      </button>
                      {/* Opcional: link al video */}
                      {ej.ejercicio.video_url && (
                        <a
                          className="mt-2 text-sm text-indigo-600 hover:underline"
                          href={ej.ejercicio.video_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver video ▶
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

