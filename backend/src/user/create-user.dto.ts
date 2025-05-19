import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  middleName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  secondLastName: string

  @IsNotEmpty()
  @IsString()
  rutBody: string

  @IsNotEmpty()
  @IsString()
  rutDv: string

  @IsOptional()
  @IsString()
  phone: string
}
