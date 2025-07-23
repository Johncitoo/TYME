import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { getRutinaForEdit, getAllEjercicios, updateRutina } from '@/services/routine.service';
import { getAllEntrenadores } from '@/services/entrenador.service';
import { getAllClientes } from '@/services/clientes.Service';

interface EntrenadorOption {
  id_entrenador: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
  };
}
interface ClienteOption {
  id_cliente: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
  };
}
interface EjercicioOption {
  id_ejercicio: number;
  nombre: string;
}
interface Linea {
  id_rutina_ejercicio?: number;
  id_ejercicio: number;
  dia: number;
  orden: number;
  series: number;
  peso: number;
  descanso: number;
  observacion: string;
}

export default function EditRutinaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados principales
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha_inicio, setFechaInicio] = useState('');
  const [id_entrenador, setIdEntrenador] = useState<number>();
  const [id_cliente, setIdCliente] = useState<number>();
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [ejercicios, setEjercicios] = useState<EjercicioOption[]>([]);
  const [entrenadores, setEntrenadores] = useState<EntrenadorOption[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Usa el endpoint correcto
    getRutinaForEdit(Number(id))
      .then(rutina => {
        setNombre(rutina.nombre || '');
        setDescripcion(rutina.descripcion || '');
        setFechaInicio(rutina.fecha_inicio?.slice(0, 10) || '');
        setIdEntrenador(rutina.entrenador?.id_entrenador);
        setIdCliente(rutina.id_cliente ?? undefined);
        setLineas(
          (rutina.rutinaEjercicios || []).map((re: {
            id_rutina_ejercicio: number;
            ejercicio: { id_ejercicio: number };
            dia: number | string;
            orden: number | string;
            series: number | string;
            peso: number | string;
            descanso: number | string;
            observacion?: string;
          }) => ({
            id_rutina_ejercicio: re.id_rutina_ejercicio,
            id_ejercicio: re.ejercicio.id_ejercicio,
            dia: Number(re.dia),
            orden: Number(re.orden),
            series: Number(re.series),
            peso: Number(re.peso),
            descanso: Number(re.descanso),
            observacion: re.observacion || '',
          }))
        );
      })
      .catch(() => setError('No se pudo cargar la rutina'));

    getAllEjercicios().then(setEjercicios).catch(() => setEjercicios([]));
    getAllEntrenadores().then(setEntrenadores).catch(() => setEntrenadores([]));
    getAllClientes().then(setClientes).catch(() => setClientes([]));
  }, [id]);

  const handleLineaChange = (
    idx: number,
    campo: keyof Linea,
    valor: number | string
  ) => {
    setLineas(old => old.map((l, i) => i === idx ? { ...l, [campo]: valor } : l));
  };

  const handleAddLinea = () => {
    setLineas(old => [
      ...old,
      {
        id_ejercicio: 0,
        dia: 1,
        orden: old.length + 1,
        series: 1,
        peso: 0,
        descanso: 60,
        observacion: '',
      },
    ]);
  };

  const handleRemoveLinea = (idx: number) => {
    setLineas(old => old.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !fecha_inicio || !id_entrenador || !id_cliente) {
      setError('Faltan campos obligatorios');
      return;
    }
    if (lineas.some(l => !l.id_ejercicio || l.id_ejercicio === 0)) {
      setError('Todos los ejercicios deben estar completos');
      return;
    }

    try {
      await updateRutina(Number(id), {
        nombre,
        descripcion,
        fecha_inicio,
        id_entrenador,
        ejercicios: lineas,
        id_cliente,
      });
      navigate('/admin/rutinas');
    } catch {
      setError('Error al guardar cambios');
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Editar rutina</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="bg-white p-6 rounded shadow space-y-6" onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input
              className="w-full border p-2 rounded"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción</label>
            <input
              className="w-full border p-2 rounded"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
          </div>
          <div>
            <label>Fecha inicio</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={fecha_inicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Entrenador</label>
            <select
              className="w-full border p-2 rounded"
              value={id_entrenador ?? ''}
              onChange={e => setIdEntrenador(Number(e.target.value))}
              required
            >
              <option value="">Selecciona un entrenador…</option>
              {entrenadores.map(ent => (
                <option key={ent.id_entrenador} value={ent.id_entrenador}>
                  {ent.usuario.primer_nombre} {ent.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cliente asignado</label>
            <select
              className="w-full border p-2 rounded"
              value={id_cliente ?? ''}
              onChange={e => setIdCliente(Number(e.target.value))}
              required
            >
              <option value="">Selecciona un cliente…</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.usuario.primer_nombre} {c.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>

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
                <div key={idx} className="grid grid-cols-8 gap-2 items-end">
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
                  <div>
                    <label>Día</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={l.dia}
                      onChange={e => handleLineaChange(idx, 'dia', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Orden</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={l.orden}
                      onChange={e => handleLineaChange(idx, 'orden', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Series</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={l.series}
                      onChange={e => handleLineaChange(idx, 'series', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Peso</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={l.peso}
                      onChange={e => handleLineaChange(idx, 'peso', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Descanso</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={l.descanso}
                      onChange={e => handleLineaChange(idx, 'descanso', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Obs.</label>
                    <input
                      className="w-full border p-2 rounded"
                      value={l.observacion}
                      onChange={e => handleLineaChange(idx, 'observacion', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveLinea(idx)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded"
          >
            Guardar cambios
          </button>
        </form>
      </main>
    </div>
  );
}
