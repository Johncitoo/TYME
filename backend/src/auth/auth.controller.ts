import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface AuthUser {
  id: string;
  email: string;
  // add other user properties as needed
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const userWithToken = (await this.authService.login(
      body.email,
      body.password,
    )) as { token: string; user: AuthUser } | null;
    if (!userWithToken) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return userWithToken;
  }


  

  
}
