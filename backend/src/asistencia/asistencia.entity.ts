// src/asistencia/asistencia.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Clase } from '../clase/clase.entity';

@Entity('asistencia')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id_asistencia: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Clase, { eager: true })
  @JoinColumn({ name: 'id_clase' })
  clase: Clase;

  @Column({ type: 'date' })
  fecha: string;
}
