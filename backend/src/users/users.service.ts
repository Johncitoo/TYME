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
}