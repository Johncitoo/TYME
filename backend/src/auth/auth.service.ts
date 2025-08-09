// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Entrenador } from '../entities/entrenador.entity';

export interface JwtUser {
  id_usuario: number;
  correo: string;
  primer_nombre: string;
  tipo_usuario: string;
}

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
    @InjectRepository(Entrenador)
    private readonly entrenadorRepository: Repository<Entrenador>,
  ) {}

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

  // CORREGIDO: Token SIEMPRE con expiración explícita (12h)
  generateJwtToken(user: JwtUser): string {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      correo: user.correo,
      role: user.tipo_usuario,
    };
    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.tipo_usuario', 'tipo_usuario')
      .where('usuario.correo = :email', { email })
      .getOne();

    if (!user || user.contrasena !== password) {
      return null;
    }

    const token = this.generateJwtToken({
      id_usuario: user.id_usuario,
      correo: user.correo,
      primer_nombre: user.primer_nombre,
      tipo_usuario: user.tipo_usuario?.nombre || '',
    });

    // Verificar si es entrenador
    const entrenador = await this.entrenadorRepository.findOne({
      where: { id_usuario: user.id_usuario },
    });

    return {
      id_usuario: user.id_usuario,
      correo: user.correo,
      primer_nombre: user.primer_nombre,
      tipo_usuario: user.tipo_usuario?.nombre || '',
      token,
      ...(entrenador && { id_entrenador: entrenador.id_entrenador }), // <- clave
    };
  }
}
