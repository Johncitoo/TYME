import { IsInt, IsDateString, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateClaseDto {
  @IsDateString()
  fecha_clase: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  hora_inicio: string;

  @IsString()
  @IsNotEmpty()
  hora_fin: string;

  @IsInt()
  @Min(1)
  cupo_maximo: number;

  @IsInt()
  @Min(1)
  id_entrenador: number; // <-- Obligatorio y mayor a 0
}
