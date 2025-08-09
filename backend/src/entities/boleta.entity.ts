import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoMetodoPago } from './tipoMetodoPago.entity';
import { Cliente } from './cliente.entity';
import { Membresia } from './membresia.entity';

@Entity({ name: 'boleta' })
export class Boleta {
  @PrimaryGeneratedColumn({ name: 'id_boleta' })
  id_boleta: number;

  @Column({ type: 'date' })
  fecha_pago: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @ManyToOne(() => TipoMetodoPago, (tipo) => tipo.boletas)
  @JoinColumn({ name: 'metodo_pago' })
  metodo_pago: TipoMetodoPago;

  @ManyToOne(() => Cliente, (cliente) => cliente.boletas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Membresia, (membresia) => membresia.boletas)
  @JoinColumn({ name: 'id_membresia' })
  membresia: Membresia;
}
