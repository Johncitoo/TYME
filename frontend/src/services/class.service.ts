import axios from "axios";

const API_URL = "http://localhost:3000"; // Cambia si tienes otra URL/puerto
const getToken = () => localStorage.getItem("token");

// OBTENER TODAS LAS CLASES DISPONIBLES
export async function getClasesDisponibles() {
  const res = await axios.get(`${API_URL}/clase`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

// OBTENER ASISTENCIAS DEL CLIENTE
export async function getAsistenciasCliente() {
  const res = await axios.get(`${API_URL}/asistencia/mis-asistencias`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

