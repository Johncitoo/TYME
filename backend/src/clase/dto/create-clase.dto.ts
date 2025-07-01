// src/clase/dto/create-clase.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateClaseDto {
  @IsNotEmpty()
  fecha_clase: string; // formato YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  hora_inicio: string; // formato HH:mm:ss

  @IsNotEmpty()
  hora_fin: string; // formato HH:mm:ss

  @IsInt()
  @IsNotEmpty()
  cupo_maximo: number;
}
