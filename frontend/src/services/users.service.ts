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
export async function getPerfilUsuario(): Promise<PerfilUsuario> {
  const res = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
}

// Actualiza el perfil del usuario logeado
export async function updatePerfilUsuario(payload: PerfilUsuario) {
  // Primero, obtenemos el perfil para el id
  const profile = await getPerfilUsuario();
  const id_usuario = (profile as any).id_usuario; // Ajusta si usas otro nombre

  const res = await axios.put(
    `${API_URL}/users/${id_usuario}`,
    payload,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return res.data;
}
