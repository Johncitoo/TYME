import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejercicio } from '../entities/ejercicio.entity';
import { EjercicioService } from './ejercicio.service';
import { EjercicioController } from './ejercicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ejercicio])],
  providers: [EjercicioService],
  controllers: [EjercicioController],
})
export class EjercicioModule {}
