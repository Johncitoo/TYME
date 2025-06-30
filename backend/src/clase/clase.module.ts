import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from './clase.entity';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { Asistencia } from '../asistencia/asistencia.entity';
import { Entrenador } from '../entities/entrenador.entity';
import { Usuario } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clase, Asistencia, Entrenador, Usuario])],
  controllers: [ClaseController],
  providers: [ClaseService],
  exports: [ClaseService],
})
export class ClaseModule {}
