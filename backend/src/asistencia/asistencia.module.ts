// src/asistencia/asistencia.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { Cliente } from '../entities/cliente.entity';
import { Clase } from '../clase/clase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, Cliente, Clase])],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [AsistenciaService],
})
export class AsistenciaModule {}
