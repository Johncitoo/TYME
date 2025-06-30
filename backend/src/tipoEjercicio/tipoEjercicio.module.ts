import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEjercicioService } from './tipoEjercicio.service';
import { TipoEjercicioController } from './tipoEjercicio.controller';
import { TipoEjercicio } from '../entities/tipoEjercicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEjercicio])],
  providers: [TipoEjercicioService],
  controllers: [TipoEjercicioController],
  exports: [TipoEjercicioService],
})
export class TipoEjercicioModule {}
