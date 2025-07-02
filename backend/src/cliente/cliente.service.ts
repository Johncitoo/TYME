// src/cliente/cliente.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  /** Devuelve todos los clientes con su usuario (para el select) */
  findAll(): Promise<Cliente[]> {
    return this.clienteRepo.find({
      relations: ['usuario'], // cargamos los datos del usuario
      select: {
        id_cliente: true,
        usuario: {
          primer_nombre: true,
          primer_apellido: true,
        },
      },
    });
  }
}
