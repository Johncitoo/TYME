import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from './clase.entity';
import { Entrenador } from '../entities/entrenador.entity';
import { Usuario } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clase, Entrenador, Usuario])],
  controllers: [ClaseController],
  providers: [ClaseService],
})
export class ClaseModule {}
