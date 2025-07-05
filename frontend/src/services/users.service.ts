import axios from "axios";

export interface PerfilUsuario {
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  // agrega más campos si tu backend los retorna
}

const API_URL = "http://localhost:3000";
const getToken = () => localStorage.getItem("token");

// Trae el perfil del usuario logeado
export async function getPerfilUsuario() {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

export async function updatePerfilUsuario(updateData: any) {
  const res = await axios.put(`${API_URL}/users/me`, updateData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}
