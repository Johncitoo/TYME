// src/rutinas/rutinas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinasService } from './rutinas.service';
import { RutinasController } from './rutinas.controller';
import { Rutina } from '../entities/rutina.entity'; // Ajusta la ruta si es necesario
import { Cliente } from '../entities/cliente.entity'; // Ajusta la ruta si es necesario
import { ClienteRutina } from '../entities/clienteRutina.entity';
import { RutinaEjercicio } from '../entities/rutinaEjercicio.entity';
import { Ejercicio } from '../entities/ejercicio.entity';
import { TipoGrupoMuscular } from 'entities/tipoGrupoMuscular.entity';
import { TipoEjercicio } from 'entities/tipoEjercicio.entity';
import { RutinaEjercicioService } from '../rutinaEjercicio/rutinaEjercicioService';
import { RutinaEjercicioController } from '../rutinaEjercicio/rutinaEjercicioController';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rutina,
      Cliente,
      ClienteRutina,
      RutinaEjercicio,
      Ejercicio,
      TipoGrupoMuscular,
      TipoEjercicio,
    ]),
  ],
  providers: [RutinasService, RutinaEjercicioService],
  controllers: [RutinasController, RutinaEjercicioController],
  exports: [RutinasService, RutinaEjercicioService],
})
export class RutinasModule {}
