// src/users/dto/update-user.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  primer_nombre?: string;

  @IsOptional()
  @IsString()
  segundo_nombre?: string;

  @IsOptional()
  @IsString()
  primer_apellido?: string;

  @IsOptional()
  @IsString()
  segundo_apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  // Si quieres permitir editar otros campos, agrégalos aquí igual con @IsOptional()
}
