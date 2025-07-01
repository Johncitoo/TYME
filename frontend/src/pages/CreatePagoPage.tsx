// src/pages/CreatePagoPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '@/components/AdminSidebar';
import { crearPago } from '@/services/pagos.service';

export default function CreatePagoPage() {
  const navigate = useNavigate();
  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<number>(1);
  const [idCliente, setIdCliente] = useState<number>(1);
  const [idMembresia, setIdMembresia] = useState<number>(1);
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState<string | null>(null);

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
              className="w-full border p-2 rounded"
              value={monto}
              onChange={e => setMonto(Number(e.target.value))}
            />
          </div>

          <div>
            <label>ID Método de pago</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={metodoPago}
              onChange={e => setMetodoPago(Number(e.target.value))}
            />
          </div>

          <div>
            <label>ID Cliente</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={idCliente}
              onChange={e => setIdCliente(Number(e.target.value))}
            />
          </div>

          <div>
            <label>ID Membresía</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={idMembresia}
              onChange={e => setIdMembresia(Number(e.target.value))}
            />
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
