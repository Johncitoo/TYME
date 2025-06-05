import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Usuario } from '../entities/user.entity';
import { Cliente } from '../entities/cliente.entity';
import { TipoMembresia } from '../entities/tipo_membresia.entity';
import { Entrenador } from '../entities/entrenador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Cliente,
      TipoMembresia,
      Entrenador, // ← Asegúrate de agregar aquí estas dos entidades
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
