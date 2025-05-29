import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { correo: email },
      relations: ['tipoUsuario'],
    });
  }

  async getAllClientes(): Promise<Usuario[]> {
    const clientes = await this.repo.find({
      where: {
        tipo_usuario: { id_tipo_usuario: 2 },
      },
      relations: ['tipo_usuario'],
    });
    console.log('CLIENTES ENCONTRADOS:', clientes.length);
    return clientes;
  }
}
