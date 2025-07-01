import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinaEjercicio } from './rutinaEjercicio.entity';
import { Rutina } from '../entities/rutina.entity';
import { Ejercicio } from '../entities/ejercicio.entity'; // corregido aquí
import { RutinaEjercicioController } from './rutinaEjercicio.controller';
import { RutinaEjercicioService } from './rutinaEjercicio.service';

@Module({
  imports: [TypeOrmModule.forFeature([RutinaEjercicio, Rutina, Ejercicio])],
  controllers: [RutinaEjercicioController],
  providers: [RutinaEjercicioService],
  exports: [RutinaEjercicioService],
})
export class RutinaEjercicioModule {}
