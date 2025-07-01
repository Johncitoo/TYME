import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateEjercicioNestedDto {
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
