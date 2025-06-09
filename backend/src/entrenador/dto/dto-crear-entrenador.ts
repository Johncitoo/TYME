// src/entrenador/dto/dto-crear-entrenador.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
} from 'class-validator';

/**
 * DTO que define la forma en que el frontend enviará
 * los datos necesarios para crear un entrenador.
 */
export class DtoCrearEntrenador {
  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  cuerpo_rut: string;

  @IsString()
  @IsNotEmpty()
  dv_rut: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento: string;

  // FK a tabla tipo_genero
  @IsInt()
  @IsNotEmpty()
  id_tipo_genero: number;

  // FK a tabla tipo_sexo
  @IsInt()
  @IsNotEmpty()
  id_tipo_sexo: number;

  // FK a tabla contacto_emergencia
  @IsInt()
  @IsNotEmpty()
  id_contacto_emergencia: number;

  /**
   * Arreglo de IDs de especialidades (FK a tipo_especialidad).
   * Debe venir al menos un elemento, y cada ID es único.
   */
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  especialidades: number[];
}
