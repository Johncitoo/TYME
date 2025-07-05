// src/asistencia/dto/create-asistencia.dto.ts
import { IsInt, IsDateString } from 'class-validator';

export class CreateAsistenciaDto {
  @IsInt()
  id_clase: number;
  // fecha y cliente se ponen automáticamente desde el backend
}
