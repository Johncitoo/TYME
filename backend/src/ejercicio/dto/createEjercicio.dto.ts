import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateEjercicioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsInt()
  id_grupo_muscular: number;

  @IsInt()
  id_tipo_ejercicio: number;
}
