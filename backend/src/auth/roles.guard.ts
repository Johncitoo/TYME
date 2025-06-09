// backend/src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

interface RequestWithUser {
  user: {
    tipo_usuario?: { nombre: string };
    role?: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // 1) Lee metadata de roles permitidos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    // 2) Obtiene el usuario que JWT guardó en request.user
    const { user } = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!requiredRoles) {
      // Si no hay @Roles en la ruta, está abierta tras JWT
      return true;
    }

    if (!user) return false;

    // 3) Extrae el rol del usuario (ajústalo según tu DTO: user.tipo_usuario.nombre o user.role)
    const userRole =
      typeof user.tipo_usuario === 'object'
        ? user.tipo_usuario.nombre.toLowerCase()
        : typeof user.role === 'string'
          ? user.role.toLowerCase()
          : null;

    if (!userRole) return false;

    // 4) Comprueba si está en la lista de permitidos
    return requiredRoles.map((r) => r.toLowerCase()).includes(userRole);
  }
}
