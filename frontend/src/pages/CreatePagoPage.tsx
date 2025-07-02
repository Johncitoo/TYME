import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { crearPago } from '@/services/pagos.service';
import { getAllClientes } from '@/services/clientes.Service';
import { getAllMetodosPago } from '@/services/metodos.service';
import { getAllMembresias } from '@/services/membresias.service';

export default function CreatePagoPage() {
  const navigate = useNavigate();

  type Membresia = { id_membresia: number; nombre: string; precio: number };
  type Cliente = { id_cliente: number; usuario: { primer_nombre: string; primer_apellido: string } };
  type MetodoPago = { id_metodo: number; nombre: string };

  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<number>();
  const [idCliente, setIdCliente] = useState<number>();
  const [idMembresia, setIdMembresia] = useState<number>();
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [membresias, setMembresias] = useState<Membresia[]>([]);

  useEffect(() => {
    getAllClientes().then(setClientes).catch(() => setError('Error cargando clientes'));
    getAllMetodosPago().then(setMetodos).catch(() => setError('Error cargando métodos de pago'));
    getAllMembresias().then(setMembresias).catch(() => setError('Error cargando membresías'));
  }, []);

  useEffect(() => {
    if (idMembresia) {
      const seleccionada = membresias.find(m => m.id_membresia === idMembresia);
      if (seleccionada) setMonto(seleccionada.precio);
    }
  }, [idMembresia, membresias]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaPago || !monto || !metodoPago || !idCliente || !idMembresia) {
      setError('Todos los campos obligatorios');
      return;
    }

    crearPago({
      fecha_pago: fechaPago,
      monto,
      metodo_pago: metodoPago,
      id_cliente: idCliente,
      id_membresia: idMembresia,
      observacion: observacion || undefined,
    })
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate('/admin/pagos'), 1800); // redirige tras mostrar éxito
      })
      .catch(() => setError('Error al registrar pago'));
  };

  return (
    <div className="flex h-screen bg-[#1e1e2f] text-white">
      <SidebarAdmin />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Registrar Pago</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && (
          <p className="text-green-400 text-lg mb-4 animate-pulse transition-all duration-300">
            ✅ ¡Pago registrado correctamente!
          </p>
        )}

        <form onSubmit={handleSubmit} className="bg-[#2b2b3d] p-6 rounded-xl shadow space-y-5 max-w-xl">
          <div>
            <label className="block text-sm text-cyan-300 mb-1">Fecha de pago</label>
            <input
              type="date"
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-white"
              value={fechaPago}
              onChange={e => setFechaPago(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-cyan-300 mb-1">Monto</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-gray-400 cursor-not-allowed"
              value={monto}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-cyan-300 mb-1">Método de pago</label>
            <select
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-white"
              value={metodoPago ?? ''}
              onChange={e => setMetodoPago(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {metodos.map(m => (
                <option key={m.id_metodo} value={m.id_metodo}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-cyan-300 mb-1">Cliente</label>
            <select
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-white"
              value={idCliente ?? ''}
              onChange={e => setIdCliente(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.usuario.primer_nombre} {c.usuario.primer_apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-cyan-300 mb-1">Membresía</label>
            <select
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-white"
              value={idMembresia ?? ''}
              onChange={e => setIdMembresia(Number(e.target.value))}
            >
              <option value="">– Selecciona –</option>
              {membresias.map(m => (
                <option key={m.id_membresia} value={m.id_membresia}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-cyan-300 mb-1">Observación</label>
            <input
              className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-600 text-white"
              value={observacion}
              onChange={e => setObservacion(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-semibold transition"
          >
            Confirmar Pago
          </button>
        </form>
      </main>
    </div>
  );
}

