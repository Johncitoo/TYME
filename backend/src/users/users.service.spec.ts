// src/services/user.service.ts
import axios from "axios";

const API_URL = "http://localhost:3000";
const getToken = () => localStorage.getItem("token");

// Obtener perfil actual
export async function getPerfilUsuario() {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

// Actualizar perfil actual
export async function updatePerfilUsuario(updateData: any) {
  const res = await axios.put(`${API_URL}/users/me`, updateData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}
