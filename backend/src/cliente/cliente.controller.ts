import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entities/cliente.entity';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @Get('entrenador/:id')
  findByEntrenador(@Param('id', ParseIntPipe) id: number): Promise<Cliente[]> {
    return this.clienteService.findByEntrenador(id);
  }
}
