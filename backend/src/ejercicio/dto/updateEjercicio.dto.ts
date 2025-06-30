import { PartialType } from '@nestjs/mapped-types';
import { CreateEjercicioDto } from './createEjercicio.dto';

export class UpdateEjercicioDto extends PartialType(CreateEjercicioDto) {}
