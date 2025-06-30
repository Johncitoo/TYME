// backend/src/cliente-rutina/entities/cliente-rutina.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Rutina } from './rutina.entity';

@Entity('cliente_rutina')
export class ClienteRutina {
  @PrimaryGeneratedColumn({ name: 'id_cliente_rutina' })
  id: number;

  @Column({ length: 20 })
  estado: string;

  @ManyToOne(() => Rutina, (rutina) => rutina.clientesRutinas)
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;

  @ManyToOne(() => Cliente, (cliente) => cliente.clientesRutinas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
