// src/users/users.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../entities/user.entity';
import { Cliente } from '../entities/cliente.entity';
import { TipoMembresia } from '../entities/tipo_membresia.entity';
import { Entrenador } from '../entities/entrenador.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,

    @InjectRepository(TipoMembresia)
    private readonly tipoMembRepo: Repository<TipoMembresia>,

    @InjectRepository(Entrenador)
    private readonly entrenadorRepo: Repository<Entrenador>,
  ) {}

  /**
   * Busca un usuario por correo electrónico.
   */
  findByEmail(email: string) {
    return this.usuarioRepo.findOne({
      where: { correo: email },
      relations: ['tipo_usuario'], // asume que en Usuario tienes @ManyToOne(() => TipoUsuario)
    });
  }

  /**
   * Devuelve todos los usuarios cuyo id_tipo_usuario sea 2 (clientes).
   */
  async getAllClientes(): Promise<Usuario[]> {
    const clientes = await this.usuarioRepo.find({
      where: {
        id_tipo_usuario: 2, // suponiendo que en Usuario tienes una columna id_tipo_usuario
      },
      relations: ['tipo_usuario'], // si quieres incluir datos del tipo de usuario
    });
    console.log('CLIENTES ENCONTRADOS:', clientes.length);
    return clientes;
  }

  /**
   * Crea un usuario. Si id_tipo_usuario === 2 (cliente), crea también la fila en la tabla `cliente`
   * y la asocia a una membresía (lookup) y a un entrenador.
   */
  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    // 1) Creamos el usuario genérico en la tabla "usuario"
    const usuario = this.usuarioRepo.create(createUserDto);
    const savedUser = await this.usuarioRepo.save(usuario);

    // 2) Si es tipo “cliente” (id_tipo_usuario === 2), validamos y guardamos en "cliente"
    if (createUserDto.id_tipo_usuario === 2) {
      // 2.a) Validar que venga id_tipo_membresia en el DTO
      if (!createUserDto.id_tipo_membresia) {
        throw new BadRequestException(
          'Debe especificar id_tipo_membresia para un cliente.',
        );
      }
      // 2.b) Validar que venga id_entrenador en el DTO
      if (!createUserDto.id_entrenador) {
        throw new BadRequestException(
          'Debe especificar id_entrenador para un cliente.',
        );
      }

      // 2.c) Buscar la entidad TipoMembresia (lookup)
      const tipoMemb = await this.tipoMembRepo.findOne({
        where: { id_tipo_membresia: createUserDto.id_tipo_membresia },
      });
      if (!tipoMemb) {
        throw new BadRequestException('Tipo de membresía no encontrado.');
      }

      // 2.d) Buscar la entidad Entrenador
      const entrenador = await this.entrenadorRepo.findOne({
        where: { id_entrenador: createUserDto.id_entrenador },
      });
      if (!entrenador) {
        throw new BadRequestException('Entrenador no encontrado.');
      }

      // 2.e) Crear la fila en la tabla "cliente"
      const cliente = this.clienteRepo.create({
        usuario: savedUser,
        tipoMembresia: tipoMemb,
        entrenador: entrenador,
      });
      await this.clienteRepo.save(cliente);
    }

    return savedUser;
  }
}
