import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  segundo_nombre?: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;
}
