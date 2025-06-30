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

// INSCRIBIR ASISTENCIA EN UNA CLASE
export async function inscribirAsistencia({ id_clase }: { id_clase: number }) {
  const res = await axios.post(`${API_URL}/asistencia`, { id_clase }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}

// CREAR UNA CLASE (para admin/entrenador)
export async function createClass(classData: {
  nombre: string;
  descripcion?: string;
  fecha_clase: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  // puedes agregar otros campos según tu DTO
}) {
  const res = await axios.post(`${API_URL}/clase`, classData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
}
