import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateRutinaEjercicioDto } from '../../rutinaEjercicio/dto/createRutinaEjercicio.dto';

export class CreateRutinaDto {
  @IsNotEmpty()
  @IsInt()
  id_entrenador: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_inicio: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1) // opcional: si quieres al menos 1 elemento
  @ValidateNested({ each: true })
  @Type(() => CreateRutinaEjercicioDto)
  ejercicios?: CreateRutinaEjercicioDto[];
}
