import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateAdminDto } from './update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usersRepo: Repository<Usuario>,
  ) {}

  async getProfile(id: number): Promise<Usuario> {
    const user = await this.usersRepo.findOne({
      where: { id_usuario: id },
      relations: ['tipo_usuario'], // si quieres incluir el rol
    });
    if (!user) throw new NotFoundException('Administrador no encontrado');
    return user;
  }

  async updateProfile(id: number, dto: UpdateAdminDto): Promise<Usuario> {
    const user = await this.usersRepo.preload({
      id_usuario: id, // <— snake_case, coincide con la propiedad TS
      primer_nombre: dto.primer_nombre, // <— snake_case
      segundo_nombre: dto.segundo_nombre, // <— snake_case
      correo: dto.correo,
      telefono: dto.telefono,
    });

    if (!user) {
      throw new NotFoundException('Administrador no encontrado');
    }
    return this.usersRepo.save(user);
  }
}
