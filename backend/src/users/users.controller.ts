// users.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common'; // Add Post and Body to imports
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('clientes')
  async getClientes() {
    return this.usersService.getAllClientes();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // ...otros endpoints
}
