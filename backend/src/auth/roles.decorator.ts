// backend/src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * Marca los roles permitidos en el handler o controlador
 * Uso: @Roles('admin', 'cliente')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
