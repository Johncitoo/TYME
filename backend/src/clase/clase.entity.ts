import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entrenador } from '../entities/entrenador.entity';

@Entity('clase')
export class Clase {
  @PrimaryGeneratedColumn()
  id_clase: number;

  @Column({ type: 'date' })
  fecha_clase: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({ type: 'int' })
  cupo_maximo: number;

  @ManyToOne(() => Entrenador, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_entrenador' })
  entrenador?: Entrenador;
}
