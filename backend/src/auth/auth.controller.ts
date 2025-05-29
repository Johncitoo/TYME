import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const token = this.authService.generateJwtToken(user);
    // src/auth/auth.controller.ts
    return {
      id_usuario: user.id_usuario,
      correo: user.correo,
      primer_nombre: user.primer_nombre,
      tipo_usuario: user.tipo_usuario, // Esto debe ser un STRING, no un objeto ni número
      token,
    };
  }
}
