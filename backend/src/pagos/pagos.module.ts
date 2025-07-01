import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Boleta } from '../entities/boleta.entity';
import { TipoMetodoPago } from '../entities/tipoMetodoPago.entity';
import { Cliente } from '../entities/cliente.entity';
import { Membresia } from '../entities/membresia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleta, TipoMetodoPago, Cliente, Membresia]),
  ],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
