// frontend/src/services/routine.service.ts
import axios from "axios";

const API_URL = "http://localhost:3000"; // ¡Asegúrate de que esta URL sea la correcta para tu backend!

interface CreateRoutinePayload {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
}

export const createRoutine = async (routineData: CreateRoutinePayload) => {
  try {
    const response = await axios.post(`${API_URL}/rutinas`, routineData); // Tu endpoint de backend para crear rutinas
    return response.data;
  } catch (error) {
    console.error("Error al crear la rutina:", error);
    throw error; // Propaga el error para que el componente pueda manejarlo
  }
};

