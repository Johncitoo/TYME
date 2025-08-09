// backend/src/cliente-rutina/entities/cliente-rutina.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Rutina } from './rutina.entity';

@Entity('cliente_rutina')
@Unique('cliente_rutina_id_rutina_id_cliente_key', ['idRutina', 'idCliente'])
export class ClienteRutina {
  @PrimaryGeneratedColumn({ name: 'id_cliente_rutina' })
  id: number;

  @Column({ length: 20 })
  estado: string;

  // FK explícita para rutina
  @Column({ name: 'id_rutina', nullable: false })
  idRutina: number;

  @ManyToOne(() => Rutina, (rutina) => rutina.clientesRutinas, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;

  // FK explícita para cliente
  @Column({ name: 'id_cliente', nullable: false })
  idCliente: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.clientesRutinas, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
