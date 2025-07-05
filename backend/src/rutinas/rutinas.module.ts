import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinasService } from './rutinas.service';
import { RutinasController } from './rutinas.controller';
import { Rutina } from '../entities/rutina.entity';
import { Cliente } from '../entities/cliente.entity';
import { ClienteRutina } from '../entities/clienteRutina.entity';
import { RutinaEjercicio } from '../entities/rutinaEjercicio.entity';
import { Ejercicio } from '../entities/ejercicio.entity';
// Importa el módulo que exporta RutinaEjercicioService:
import { RutinaEjercicioModule } from '../rutinaEjercicio/rutinaEjercicio.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rutina,
      Cliente,
      ClienteRutina,
      RutinaEjercicio,
      Ejercicio,
    ]),
    RutinaEjercicioModule,
  ],
  controllers: [RutinasController],
  providers: [RutinasService],
  exports: [RutinasService],
})
export class RutinasModule {}
