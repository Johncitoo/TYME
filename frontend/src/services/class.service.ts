// frontend/src/services/class.service.ts
import axios from "axios";

const API_URL = "http://localhost:3000"; // Asegúrate de que coincida con la URL de tu backend

interface CreateClassPayload {
  nombre: string;
  descripcion: string;
  hora_inicio: string;
  hora_termino: string;
  cupo_maximo: number;
  especialidades: number[];
  // Agrega el ID del entrenador aquí si decides vincular un entrenador durante la creación de la clase
  // id_entrenador?: number;
}

export const createClass = async (classData: CreateClassPayload) => {
  try {
    const response = await axios.post(`${API_URL}/clases`, classData); // Tu endpoint de backend para crear clases
    return response.data;
  } catch (error) {
    console.error("Error al crear la clase:", error);
    throw error;
  }
};

