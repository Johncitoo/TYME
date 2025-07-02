// frontend/src/pages/CreateRutinaPage.tsx
import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { getAllEjercicios, createRutina } from '@/services/routine.service';
import { getAllEntrenadores } from '@/services/entrenador.service';
import { getAllClientes } from '@/services/clientes.Service';
import type { RutinaEjercicioPayload } from '@/services/routine.service';

interface EjercicioOption { id_ejercicio: number; nombre: string }
interface EntrenadorOption { id_entrenador: number; usuario: { primer_nombre: string; primer_apellido: string } }
interface ClienteOption { id_cliente: number; usuario: { primer_nombre: string; primer_apellido: string } }
interface Linea { id_ejercicio?: number; dia: number; orden: number; series: number; peso: number; descanso: number; observacion: string; }

export default function CreateRutinaPage() {
  const navigate = useNavigate();

  // Datos básicos
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selEntrenador, setSelEntrenador] = useState<number>();
  const [selCliente, setSelCliente] = useState<number>();

  // Fecha desglosada
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  // Catálogos
  const [ejercicios, setEjercicios] = useState<EjercicioOption[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorOption[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);

  // Líneas de rutina
  const [lineas, setLineas] = useState<Linea[]>([
    { dia: 1, orden: 1, series: 3, peso: 0, descanso: 60, observacion: '' },
  ]);
  const [error, setError] = useState<string | null>(null);

  // Cargar catálogos al montar
  useEffect(() => {
    getAllEjercicios().then(setEjercicios).catch(() => setError('No se pudieron cargar los ejercicios'));
    getAllEntrenadores().then(setEntrenadores).catch(() => setError('No se pudieron cargar los entrenadores'));
    getAllClientes()
      .then(data => {
        console.log('📋 Clientes raw:', data);
        setClientes(data);
      })
      .catch(() => setError('No se pudieron cargar los clientes'));
  }, []);

  // Añadir nueva línea
  const handleAddLinea = () => {
    setLineas(old => [
      ...old,
      { dia: 1, orden: old.length + 1, series: 3, peso: 0, descanso: 60, observacion: '' },
    ]);
  };

  // Actualizar campo de línea
  const handleLineaChange = (idx: number, campo: keyof Linea, valor: string | number | undefined) => {
    setLineas(old => old.map((l, i) => i === idx ? { ...l, [campo]: valor } as Linea : l));
  };

  // Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nombre || !selEntrenador || !selCliente || !year || !month || !day) {
      setError('Nombre, entrenador, cliente y fecha completa son obligatorios');
      return;
    }
    const mm = month.padStart(2, '0');
    const dd = day.padStart(2, '0');
    const fecha_inicio = `${year}-${mm}-${dd}`;
    const ejerciciosPayload: RutinaEjercicioPayload[] = lineas.map(l => ({
      id_ejercicio: l.id_ejercicio!,
      dia: l.dia,
      orden: l.orden,
      series: l.series,
      peso: l.peso,
      descanso: l.descanso,
      observacion: l.observacion || undefined,
    }));

    try {
      await createRutina({
        id_entrenador: selEntrenador!,
        id_cliente: selCliente!,
        nombre,
        descripcion: descripcion || undefined,
        fecha_inicio,
        ejercicios: ejerciciosPayload,
      });
      navigate('/admin/rutinas');
    } catch {
      setError('Error al crear la rutina');
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Crear rutina</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
          {/* Entrenador */}
          <div>
            <label>Entrenador</label>
            <select className="w-full border p-2 rounded" value={selEntrenador || ''} onChange={e => setSelEntrenador(Number(e.target.value))}>
              <option value="">Selecciona un entrenador…</option>
              {entrenadores.map(ent => (
                <option key={ent.id_entrenador} value={ent.id_entrenador}>
                  {ent.usuario.primer_nombre} {ent.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>
          {/* Cliente */}
          <div>
            <label>Cliente</label>
            <select className="w-full border p-2 rounded" value={selCliente || ''} onChange={e => setSelCliente(Number(e.target.value))}>
              <option value="">Selecciona un cliente…</option>
              {clientes.map(cli => (
                <option key={cli.id_cliente} value={cli.id_cliente}>
                  {cli.usuario.primer_nombre} {cli.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>
          {/* Nombre, fecha y descripción */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Nombre</label>
              <input className="w-full border p-2 rounded" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label>Año</label>
                <select className="w-full border p-2 rounded" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">–</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const y = new Date().getFullYear() + i;
                    return <option key={y} value={String(y)}>{y}</option>;
                  })}
                </select>
              </div>
              <div>
                <label>Mes</label>
                <select className="w-full border p-2 rounded" value={month} onChange={e => setMonth(e.target.value)}>
                  <option value="">–</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = i + 1;
                    return <option key={m} value={String(m).padStart(2,'0')}>{String(m).padStart(2,'0')}</option>;
                  })}
                </select>
              </div>
              <div>
                <label>Día</label>
                <select className="w-full border p-2 rounded" value={day} onChange={e => setDay(e.target.value)}>
                  <option value="">–</option>
                  {Array.from({ length: 31 }, (_, i) => {
                    const d = i + 1;
                    return <option key={d} value={String(d).padStart(2,'0')}>{String(d).padStart(2,'0')}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label>Descripción</label>
              <input className="w-full border p-2 rounded" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
          </div>
          {/* Ejercicios dinámicos */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Ejercicios</h2>
            <button type="button" className="mb-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={handleAddLinea}>
              + Añadir ejercicio
            </button>
            <div className="space-y-4">
              {lineas.map((l, idx) => (
                <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                  <div className="col-span-2">
                    <label>Ejercicio</label>
                    <select className="w-full border p-2 rounded" value={l.id_ejercicio || ''} onChange={e => handleLineaChange(idx,'id_ejercicio',Number(e.target.value))}>
                      <option value="">Selecciona...</option>
                      {ejercicios.map(ex => (
                        <option key={ex.id_ejercicio} value={ex.id_ejercicio}>{ex.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <input type="number" placeholder="Día" className="w-full border p-2 rounded" value={l.dia} onChange={e => handleLineaChange(idx,'dia',Number(e.target.value))} />
                  <input type="number" placeholder="Orden" className="w-full border p-2 rounded" value={l.orden} onChange={e => handleLineaChange(idx,'orden',Number(e.target.value))} />
                  <input type="number" placeholder="Series" className="w-full border p-2 rounded" value={l.series} onChange={e => handleLineaChange(idx,'series',Number(e.target.value))} />
                  <input type="number" placeholder="Peso (kg)" className="w-full border p-2 rounded" value={l.peso} onChange={e => handleLineaChange(idx,'peso',Number(e.target.value))} />
                  <input type="number" placeholder="Descanso (s)" className="w-full border p-2 rounded" value={l.descanso} onChange={e => handleLineaChange(idx,'descanso',Number(e.target.value))} />
                  <input placeholder="Observación" className="w-full border p-2 rounded" value={l.observacion} onChange={e => handleLineaChange(idx,'observacion',e.target.value)} />
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded w-full">
            Guardar rutina
          </button>
        </form>
      </main>
    </div>
  );
}


