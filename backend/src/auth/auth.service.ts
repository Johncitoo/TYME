// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

//
// 1) Define el tipo de usuario que devuelve validateUser
//
export interface JwtUser {
  id_usuario: number;
  correo: string;
  primer_nombre: string;
  tipo_usuario: string;
}

//
// 2) Define el payload exacto que vas a firmar para JWT
//
export interface JwtPayload {
  sub: number;
  correo: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Busca y valida las credenciales. Si todo está bien,
   * devuelve un objeto JwtUser; si falla, devuelve null.
   */
  async validateUser(email: string, password: string): Promise<JwtUser | null> {
    const user = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.tipo_usuario', 'tipo_usuario')
      .where('usuario.correo = :email', { email })
      .getOne();

    if (!user || user.contrasena !== password) {
      return null;
    }

    return {
      id_usuario: user.id_usuario,
      correo: user.correo,
      primer_nombre: user.primer_nombre,
      tipo_usuario: user.tipo_usuario?.nombre || '',
    };
  }

  /**
   * Genera y devuelve el JWT, tipando entrada y payload para
   * que ESLint no se queje de `any`.
   */
  generateJwtToken(user: JwtUser): string {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      correo: user.correo,
      role: user.tipo_usuario,
    };

    // Si prefieres asíncrono, usa `signAsync` y haz este método `async`
    return this.jwtService.sign(payload);
  }
}
