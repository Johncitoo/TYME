import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinaEjercicio } from './rutinaEjercicio.entity';
import { Rutina } from '../entities/rutina.entity';
import { Ejercicio } from '/entities/ejercicio.entity';
import { RutinaEjercicioController } from './rutinaEjercicioController';
import { RutinaEjercicioService } from './rutinaEjercicioService';

@Module({
  imports: [TypeOrmModule.forFeature([RutinaEjercicio, Rutina, Ejercicio])],
  controllers: [RutinaEjercicioController],
  providers: [RutinaEjercicioService],
  exports: [RutinaEjercicioService],
})
export class RutinaEjercicioModule {}
