// frontend/src/services/cliente.service.ts
import axios from 'axios';

export interface ClienteOption {
  id_cliente: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
  };
}

export const getAllClientes = async (): Promise<ClienteOption[]> => {
  const res = await axios.get<ClienteOption[]>('http://localhost:3000/clientes');
  return res.data;
};
