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

  // ← Columna FK explícita para id_rutina
  @Column({ name: 'id_rutina' })
  idRutina: number;
  @ManyToOne(() => Rutina, (rutina) => rutina.clientesRutinas)
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;

  // ← Columna FK explícita para id_cliente
  @Column({ name: 'id_cliente' })
  idCliente: number;
  @ManyToOne(() => Cliente, (cliente) => cliente.clientesRutinas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
