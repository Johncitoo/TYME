import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.tipo_usuario', 'tipo_usuario')
      .where('usuario.correo = :email', { email })
      .getOne();

    if (!user) return null;

    if (user.contrasena !== password) return null;

    // Asegurarnos de que retornamos el nombre del tipo de usuario como string
    return {
      id_usuario: user.id_usuario,
      correo: user.correo,
      primer_nombre: user.primer_nombre,
      tipo_usuario: user.tipo_usuario?.nombre || '', // Accedemos al nombre del tipo_usuario
      // otros campos que necesites
    };
  }

  async generateJwtToken(user: any) {
    const payload = {
      sub: user.id_usuario,
      tipo_usuario: user.tipo_usuario, // Esto ya será el string del nombre
      correo: user.correo,
    };
    return this.jwtService.sign(payload);
  }
}
