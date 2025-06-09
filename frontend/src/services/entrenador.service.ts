// frontend/src/services/entrenadorApi.ts

import axios from 'axios';

// 1) Interfaz TipoEspecialidad (como devolvió tu backend)
export interface TipoEspecialidad {
  id_tipo_especialidad: number;
  nombre: string;
}

// 2) Interfaz EntrenadorTipo (cada fila de la relación entrenador_tipo)
export interface EntrenadorTipo {
  id_entrenador_tipo: number;
  tipoEspecialidad: TipoEspecialidad;
}

// 3) Interfaz Usuario (como devuelve tu backend dentro del objeto "usuario")
export interface UsuarioBackend {
  id_usuario: number;
  id_tipo_usuario: number;
  correo: string;
  contrasena: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  telefono: string;
  cuerpo_rut: string;
  dv_rut: string;
  direccion: string;
  fecha_nacimiento: string;
  fecha_registro: string;
  activo: boolean;
  id_tipo_genero: number;
  id_tipo_sexo: number;
  id_contacto_emergencia: number;
}

// 4) Interfaz Entrenador (estructura completa que devuelve GET /entrenador)
export interface EntrenadorBackend {
  id_entrenador: number;
  usuario: UsuarioBackend;
  especialidades: EntrenadorTipo[];
}

// -------------------------------------------
// A continuación tu instancia de axios:
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// 5) Obtener todos los entrenadores (corregimos el tipo de retorno)
export async function getAllEntrenadores(): Promise<EntrenadorBackend[]> {
  try {
    const respuesta = await api.get<EntrenadorBackend[]>('/entrenador');
    return respuesta.data;
  } catch (error) {
    console.error('[entrenadorApi] Error en getAllEntrenadores:', error);
    throw error;
  }
}

// 6) Obtener todas las especialidades
export async function getAllEspecialidades(): Promise<TipoEspecialidad[]> {
  try {
    const respuesta = await api.get<TipoEspecialidad[]>('/entrenador/especialidades');
    return respuesta.data;
  } catch (error) {
    console.error('[entrenadorApi] Error en getAllEspecialidades:', error);
    throw error;
  }
}

// 7) Payload para crear entrenador
export interface CrearEntrenadorPayload {
  correo: string;
  contrasena: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  telefono: string;
  cuerpo_rut: string;
  dv_rut: string;
  direccion?: string;
  fecha_nacimiento: string;      // 'YYYY-MM-DD'
  id_tipo_genero: number;
  id_tipo_sexo: number;
  id_contacto_emergencia: number;
  especialidades: number[];       // Ej: [1,4]
}

// 8) Crear un nuevo entrenador (lo que devuelve tu backend es un EntrenadorBackend)
export async function createEntrenador(
  payload: CrearEntrenadorPayload
): Promise<EntrenadorBackend> {
  try {
    const respuesta = await api.post<EntrenadorBackend>('/entrenador', payload);
    return respuesta.data;
  } catch (error) {
    console.error('[entrenadorApi] Error en createEntrenador:', error);
    throw error;
  }
}

