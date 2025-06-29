export type Ejercicio = {
  id_rutina_ejercicio: number;
  id_rutina: number;
  id_ejercicio: number;
  dia: number;                    // Día de la rutina (1, 2, 3, ...)
  orden: number;                  // Orden dentro del día
  series: number;
  peso?: number;
  descanso?: number;
  observacion?: string;
  nombre?: string;                // Puede venir si haces join con ejercicio
  ejercicio?: { nombre: string }; // Si la API te devuelve objeto anidado
};

export type Rutina = {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  rutina?: {
    nombre: string;
    descripcion?: string;
    fecha_inicio?: string;
  }; // En caso de respuestas anidadas del backend
};
