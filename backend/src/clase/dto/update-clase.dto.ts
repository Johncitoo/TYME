// src/clase/dto/update-clase.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateClaseDto } from './create-clase.dto';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {}
