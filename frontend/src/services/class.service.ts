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

// INSCRIBIR ASISTENCIA A UNA CLASE
export async function inscribirAsistencia(claseId: string) {
  const res = await axios.post(
    `${API_URL}/asistencia/${claseId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return res.data;
}

export async function cancelarAsistencia(id_asistencia: number) {
  const API_URL = "http://localhost:3000";
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/asistencia/${id_asistencia}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cancelar asistencia");
  return res.json();
}

