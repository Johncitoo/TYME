// src/rutinas/dto/update-rutina-ejercicio.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRutinaEjercicioDto } from './createRutinaEjercicio.dto';

export class UpdateRutinaEjercicioDto extends PartialType(
  CreateRutinaEjercicioDto,
) {}
