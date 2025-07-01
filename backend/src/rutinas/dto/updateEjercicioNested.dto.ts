// src/rutinas/dto/update-ejercicio-nested.dto.ts
import {
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateEjercicioNestedDto {
  @IsOptional() // ← Puede o no estar presente (para agregar/actualizar)
  @IsInt()
  id_rutina_ejercicio?: number;

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
