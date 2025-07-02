import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { crearPago } from '@/services/pagos.service';
import { getAllClientes } from '@/services/clientes.Service';
import { getAllMetodosPago } from '@/services/metodos.service';
import { getAllMembresias } from '@/services/membresias.service';

export default function CreatePagoPage() {
  const navigate = useNavigate();

  // Tipos de datos
  type Membresia = { id_membresia: number; nombre: string; precio: number };
  type Cliente = { id_cliente: number; usuario: { primer_nombre: string; primer_apellido: string } };
  type MetodoPago = { id_metodo: number; nombre: string };

  // Formulario
  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<number>();
  const [idCliente, setIdCliente] = useState<number>();
  const [idMembresia, setIdMembresia] = useState<number>();
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Catálogos
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [membresias, setMembresias] = useState<Membresia[]>([]);

  useEffect(() => {
    getAllClientes().then(setClientes).catch(() => setError('Error cargando clientes'));
    getAllMetodosPago().then(setMetodos).catch(() => setError('Error cargando métodos de pago'));
    getAllMembresias().then(setMembresias).catch(() => setError('Error cargando membresías'));
  }, []);

  // 🔁 Al cambiar membresía, asignar precio automáticamente al monto
  useEffect(() => {
    if (idMembresia) {
      const seleccionada = membresias.find(m => m.id_membresia === idMembresia);
      if (seleccionada) {
        setMonto(seleccionada.precio);
      }
    }
  }, [idMembresia, membresias]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaPago || !monto || !metodoPago || !idCliente || !idMembresia) {
      setError('Todos los campos obligatorios');
      return;
    }
    crearPago({
      fecha_pago:    fechaPago,
      monto,
      metodo_pago:   metodoPago,
      id_cliente:    idCliente,
      id_membresia:  idMembresia,
      observacion:   observacion || undefined,
    })
      .then(() => navigate('/admin/pagos'))
      .catch(() => setError('Error al registrar pago'));
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin/>
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Registrar Pago</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label>Fecha de pago</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={fechaPago}
              onChange={e => setFechaPago(e.target.value)}
            />
          </div>

          <div>
            <label>Monto</label>
            <input
              type="number"
              className="w-full border p-2 rounded bg-gray-100"
              value={monto}
              readOnly
            />
          </div>

          <div>
            <label>Método de pago</label>
            <select
              className="w-full border p-2 rounded"
              value={metodoPago ?? ''}
              onChange={e => setMetodoPago(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {Array.isArray(metodos) && metodos.map(m => (
                <option key={m.id_metodo} value={m.id_metodo}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cliente</label>
            <select
              className="w-full border p-2 rounded"
              value={idCliente ?? ''}
              onChange={e => setIdCliente(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {Array.isArray(clientes) && clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.usuario.primer_nombre} {c.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Membresía</label>
            <select
              className="w-full border p-2 rounded"
              value={idMembresia ?? ''}
              onChange={e => setIdMembresia(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {Array.isArray(membresias) && membresias.map(m => (
                <option key={m.id_membresia} value={m.id_membresia}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Observación</label>
            <input
              className="w-full border p-2 rounded"
              value={observacion}
              onChange={e => setObservacion(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded"
          >
            Guardar pago
          </button>
        </form>
      </main>
    </div>
  );
}
