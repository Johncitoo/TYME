import { Controller, Get, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  // GET perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const id_usuario = req.user.sub;
    return this.usersService.findById(id_usuario);
  }

  // PUT actualizar perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    console.log("UpdateUserDto recibido:", updateUserDto);
    const id_usuario = req.user.sub;
    return this.usersService.updateUser(id_usuario, updateUserDto);
  }

  
}
