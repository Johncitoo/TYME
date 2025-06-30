// frontend/src/pages/CreateRutinaPage.tsx
import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { getAllEjercicios } from '@/services/routine.service';
import { getAllEntrenadores } from '@/services/entrenador.service';
import { createRutina } from '@/services/routine.service';
import type { RutinaEjercicioPayload } from '@/services/routine.service';

interface EjercicioOption { id_ejercicio: number; nombre: string }
interface EntrenadorOption {
  id_entrenador: number;
  usuario: { primer_nombre: string; primer_apellido: string }
}
interface Linea {
  id_ejercicio?: number;
  dia: number;
  orden: number;
  series: number;
  peso: number;
  descanso: number;
  observacion: string;
}

export default function CreateRutinaPage() {
  const navigate = useNavigate();

  // Datos básicos
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selEntrenador, setSelEntrenador] = useState<number>();

  // Fecha desglosada
  const [year,  setYear]  = useState('');
  const [month, setMonth] = useState('');
  const [day,   setDay]   = useState('');

  // Catálogos
  const [ejercicios,   setEjercicios]   = useState<EjercicioOption[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorOption[]>([]);

  // Líneas de rutina
  const [lineas, setLineas] = useState<Linea[]>([
    { dia: 1, orden: 1, series: 3, peso: 0, descanso: 60, observacion: '' },
  ]);

  const [error, setError] = useState<string|null>(null);

  // Cargar catálogos al montar
  useEffect(() => {
    getAllEjercicios()
      .then(setEjercicios)
      .catch(() => setError('No se pudieron cargar los ejercicios'));
    getAllEntrenadores()
      .then(setEntrenadores)
      .catch(() => setError('No se pudieron cargar los entrenadores'));
  }, []);

  // Añadir nueva línea
  const handleAddLinea = () => {
    setLineas(old => [
      ...old,
      { dia: 1, orden: old.length + 1, series: 3, peso: 0, descanso: 60, observacion: '' },
    ]);
  };

  // Actualizar campo de línea
  const handleLineaChange = (
    idx: number,
    campo: keyof Linea,
    valor: string | number | undefined
  ) => {
    setLineas(old =>
      old.map((l, i) => i === idx ? { ...l, [campo]: valor } : l)
    );
  };

  // Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Validaciones
    if (!nombre || !selEntrenador || !year || !month || !day) {
      setError('Nombre, entrenador y fecha completa son obligatorios');
      return;
    }
    // Pad mes y día
    const mm = month.padStart(2, '0');
    const dd = day.padStart(2, '0');
    const fecha_inicio = `${year}-${mm}-${dd}`; // "YYYY-MM-DD"

    // Payload ejercicios
    const ejerciciosPayload: RutinaEjercicioPayload[] = lineas.map(l => ({
      id_ejercicio: l.id_ejercicio!,
      dia:          l.dia,
      orden:        l.orden,
      series:       l.series,
      peso:         l.peso,
      descanso:     l.descanso,
      observacion:  l.observacion || undefined,
    }));

    console.log('PAYLOAD:')
    createRutina( {

      nombre,
      descripcion:   descripcion || undefined,
      fecha_inicio,
      id_entrenador: selEntrenador,
      ejercicios:    ejerciciosPayload,
    })
      .then(() => navigate('/admin/rutinas'))
      .catch(() => setError('Error al crear la rutina'));
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin/>
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Crear rutina</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
          {/* Entrenador */}
          <div>
            <label>Entrenador</label>
            <select
              className="w-full border p-2 rounded"
              value={selEntrenador}
              onChange={e => setSelEntrenador(Number(e.target.value))}
            >
              <option value="">Selecciona un entrenador…</option>
              {entrenadores.map(ent => (
                <option key={ent.id_entrenador} value={ent.id_entrenador}>
                  {ent.usuario.primer_nombre} {ent.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre, fecha y descripción */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Nombre</label>
              <input
                className="w-full border p-2 rounded"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>

            {/* Fecha desglosada */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label>Año</label>
                <select
                  className="w-full border p-2 rounded"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                >
                  <option value="">–</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const y = new Date().getFullYear() + i;
                    return <option key={y} value={String(y)}>{y}</option>;
                  })}
                </select>
              </div>
              <div>
                <label>Mes</label>
                <select
                  className="w-full border p-2 rounded"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                >
                  <option value="">–</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = i + 1;
                    return (
                      <option key={m} value={String(m)}>
                        {String(m).padStart(2,'0')}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label>Día</label>
                <select
                  className="w-full border p-2 rounded"
                  value={day}
                  onChange={e => setDay(e.target.value)}
                >
                  <option value="">–</option>
                  {Array.from({ length: 31 }, (_, i) => {
                    const d = i + 1;
                    return (
                      <option key={d} value={String(d)}>
                        {String(d).padStart(2,'0')}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label>Descripción</label>
              <input
                className="w-full border p-2 rounded"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          {/* Ejercicios dinámicos */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Ejercicios</h2>
            <button
              type="button"
              className="mb-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={handleAddLinea}
            >
              + Añadir ejercicio
            </button>

            <div className="space-y-4">
              {lineas.map((l, idx) => (
                <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                  {/* Select ejercicio */}
                  <div className="col-span-2">
                    <label>Ejercicio</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={l.id_ejercicio}
                      onChange={e => handleLineaChange(idx, 'id_ejercicio', Number(e.target.value))}
                    >
                      <option value={0}>Selecciona...</option>
                      {ejercicios.map(ex => (
                        <option key={ex.id_ejercicio} value={ex.id_ejercicio}>
                          {ex.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resto de campos */}
                  <div><label>Día</label><input type="number" className="w-full border p-2 rounded" value={l.dia} onChange={e => handleLineaChange(idx,'dia',Number(e.target.value))}/></div>
                  <div><label>Orden</label><input type="number" className="w-full border p-2 rounded" value={l.orden} onChange={e => handleLineaChange(idx,'orden',Number(e.target.value))}/></div>
                  <div><label>Series</label><input type="number" className="w-full border p-2 rounded" value={l.series} onChange={e => handleLineaChange(idx,'series',Number(e.target.value))}/></div>
                  <div><label>Peso (kg)</label><input type="number" step="0.1" className="w-full border p-2 rounded" value={l.peso} onChange={e => handleLineaChange(idx,'peso',Number(e.target.value))}/></div>
                  <div><label>Descanso (s)</label><input type="number" className="w-full border p-2 rounded" value={l.descanso} onChange={e => handleLineaChange(idx,'descanso',Number(e.target.value))}/></div>
                  <div><label>Obs.</label><input className="w-full border p-2 rounded" value={l.observacion} onChange={e => handleLineaChange(idx,'observacion',e.target.value)}/></div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded"
          >
            Guardar rutina
          </button>
        </form>
      </main>
    </div>
  );
}


