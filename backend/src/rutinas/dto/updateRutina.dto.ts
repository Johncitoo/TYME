// src/rutinas/dto/updateRutina.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRutinaDto } from './createRutina.dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsInt } from 'class-validator';
import { UpdateEjercicioNestedDto } from './updateEjercicioNested.dto';

export class UpdateRutinaDto extends PartialType(CreateRutinaDto) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEjercicioNestedDto)
  ejercicios?: UpdateEjercicioNestedDto[];

  @IsOptional()
  @IsInt()
  id_cliente?: number;
}
