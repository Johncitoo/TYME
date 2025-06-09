// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Usuario } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    // Passport con estrategia 'jwt' por defecto
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuración del JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mi_clave_secreta',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard, // ✅ solo guards/provider
  ],
  controllers: [AuthController],
  exports: [
    PassportModule, // para usar @UseGuards(JwtAuthGuard) en otros módulos
    JwtModule, // si tu guard lo necesita
    AuthService, // si algún otro módulo lo inyecta directamente
    RolesGuard, // para poder usarlo en AdminModule
  ],
})
export class AuthModule {}
