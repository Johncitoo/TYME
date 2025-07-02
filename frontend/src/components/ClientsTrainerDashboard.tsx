import React, { useEffect, useState } from "react";

interface Cliente {
  id_cliente: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
    correo: string;
    telefono: string;
  };
  tipoMembresia?: {
    nombre: string;
  };
}

interface Props {
  idEntrenador: number;
}

const ClientsTrainerDashboard: React.FC<Props> = ({ idEntrenador }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idEntrenador) return;
    setLoading(true);
    fetch(`/clientes/entrenador/${idEntrenador}`) // CORREGIDO
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener clientes");
        return res.json();
      })
      .then((data) => {
        setClientes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [idEntrenador]);

  if (!idEntrenador) return <div className="p-8">No hay entrenador seleccionado</div>;
  if (loading) return <div className="p-8">Cargando clientes...</div>;
  if (!clientes.length) return <div className="p-8">No hay clientes asignados.</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Clientes Asignados</h2>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-cyan-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Membresía</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente} className="border-b">
              <td className="px-4 py-2">{c.usuario.primer_nombre} {c.usuario.primer_apellido}</td>
              <td className="px-4 py-2">{c.usuario.correo}</td>
              <td className="px-4 py-2">{c.usuario.telefono}</td>
              <td className="px-4 py-2">{c.tipoMembresia?.nombre || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTrainerDashboard;
