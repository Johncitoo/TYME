// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  correo: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET no está definido');
    }
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    };
    super(opts);
  }

  // El método validate define lo que irá en req.user
  validate(payload: JwtPayload) {
    // Devuelve SIEMPRE id_usuario, para que en los controladores uses req.user.id_usuario
    return {
      id_usuario: payload.sub,  // <-- OJO: tu token tiene 'sub', pero en runtime será 'id_usuario'
      correo: payload.correo,
      role: payload.role,
    };
  }
}
