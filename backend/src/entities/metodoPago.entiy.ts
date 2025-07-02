// src/metodo-pago/metodo-pago.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn({ name: 'id_metodo' })
  id_metodo: number;

  @Column()
  nombre: string;
}
