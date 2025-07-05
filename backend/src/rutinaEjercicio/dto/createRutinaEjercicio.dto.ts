// src/rutinas/dto/create-rutina-ejercicio.dto.ts
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateRutinaEjercicioDto {
  @IsOptional()
  @IsInt()
  id_rutina?: number;

  @IsNotEmpty()
  @IsInt()
  id_ejercicio: number;

  @IsNotEmpty()
  @IsInt()
  dia: number;

  @IsNotEmpty()
  @IsInt()
  orden: number;

  @IsNotEmpty()
  @IsInt()
  series: number;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsInt()
  descanso?: number;

  @IsOptional()
  @IsString()
  observacion?: string;
}
