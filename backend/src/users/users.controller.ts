// users.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('clientes')
  async getClientes() {
    return this.usersService.getAllClientes();
  }

  // ...otros endpoints
}
