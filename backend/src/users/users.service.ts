import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../entities/user.entity';
import { Cliente } from '../entities/cliente.entity';
import { TipoMembresia } from '../entities/tipo_membresia.entity';
import { Entrenador } from '../entities/entrenador.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  findByEmail(email: string) {
    return this.usuarioRepo.findOne({
      where: { correo: email },
      relations: ['tipo_usuario'],
    });
  }

  async findById(id: number): Promise<Usuario | undefined> {
    return (await this.usuarioRepo.findOne({ where: { id_usuario: id } })) ?? undefined;
  }

  async getAllClientes(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      where: { id_tipo_usuario: 2 },
      relations: ['tipo_usuario'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const usuario = this.usuarioRepo.create(createUserDto);
    const savedUser = await this.usuarioRepo.save(usuario);

    if (createUserDto.id_tipo_usuario === 2) {
      if (!createUserDto.id_tipo_membresia) {
        throw new BadRequestException(
          'Debe especificar id_tipo_membresia para un cliente.',
        );
      }
      if (!createUserDto.id_entrenador) {
        throw new BadRequestException(
          'Debe especificar id_entrenador para un cliente.',
        );
      }

      const tipoMemb = await this.tipoMembRepo.findOne({
        where: { id_tipo_membresia: createUserDto.id_tipo_membresia },
      });
      if (!tipoMemb) {
        throw new BadRequestException('Tipo de membresía no encontrado.');
      }

      const entrenador = await this.entrenadorRepo.findOne({
        where: { id_entrenador: createUserDto.id_entrenador },
      });
      if (!entrenador) {
        throw new BadRequestException('Entrenador no encontrado.');
      }

      const cliente = this.clienteRepo.create({
        usuario: savedUser,
        tipoMembresia: tipoMemb,
        entrenador: entrenador,
      });
      await this.clienteRepo.save(cliente);
    }

    return savedUser;
  }

  // Actualiza cualquier campo permitido del usuario autenticado
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usuarioRepo.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    Object.assign(user, updateUserDto);
    return this.usuarioRepo.save(user);
  }
}
