// src/rutinas/rutinas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinasService } from './rutinas.service';
import { RutinasController } from './rutinas.controller';
import { Rutina } from '../entities/rutina.entity'; // Ajusta la ruta si es necesario
import { Cliente } from '../entities/cliente.entity'; // Ajusta la ruta si es necesario

@Module({
  imports: [TypeOrmModule.forFeature([Rutina, Cliente])],
  providers: [RutinasService],
  controllers: [RutinasController],
  exports: [RutinasService],
})
export class RutinasModule {}
