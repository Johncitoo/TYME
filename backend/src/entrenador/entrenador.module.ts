import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrenador } from '../entities/entrenador.entity';
import { Usuario } from '../entities/user.entity';
import { EntrenadorTipo } from '../entities/entrenador_tipo.entity';
import { TipoEspecialidad } from '../entities/tipo_especialidad.entity';
import { EntrenadorService } from './entrenador.service';
import { EntrenadorController } from './entrenador.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entrenador,
      Usuario,
      EntrenadorTipo,
      TipoEspecialidad,
    ]),
  ],
  providers: [EntrenadorService],
  controllers: [EntrenadorController],
  exports: [EntrenadorService],
})
export class EntrenadorModule {}
