import {
  IsString,
  IsInt,
  IsDateString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsInt()
  id_tipo_usuario: number; // 2 = cliente

  @IsEmail()
  correo: string;

  @IsString()
  contrasena: string;

  @IsString()
  primer_nombre: string;

  @IsString()
  segundo_nombre: string;

  @IsString()
  primer_apellido: string;

  @IsString()
  segundo_apellido: string;

  @IsString()
  telefono: string;

  @IsString()
  cuerpo_rut: string;

  @IsString()
  dv_rut: string;

  @IsString()
  direccion: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsInt()
  id_tipo_genero: number;

  @IsInt()
  id_tipo_sexo: number;

  @IsInt()
  id_contacto_emergencia: number;

  // NUEVO:
  @IsNotEmpty()
  id_tipo_membresia: number;

  // NUEVO:
  @IsNotEmpty()
  id_entrenador: number;
}
