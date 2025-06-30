// backend/src/rutinas/dto/update-rutina.dto.ts
import {
  IsOptional,
  IsInt,
  IsDateString,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateRutinaDto {
  @IsOptional()
  @IsInt()
  id_entrenador?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
