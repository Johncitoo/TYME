// src/cliente/cliente.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entities/cliente.entity';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }
}
