import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rutina } from './rutina.entity';
import { Ejercicio } from './ejercicio.entity';

@Entity('rutina_ejercicio')
export class RutinaEjercicio {
  @PrimaryGeneratedColumn({ name: 'id_rutina_ejercicio' })
  id_rutina_ejercicio: number;

  @ManyToOne(() => Rutina, (rutina) => rutina.rutinaEjercicios)
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;

  @ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.rutinaEjercicios)
  @JoinColumn({ name: 'id_ejercicio' })
  ejercicio: Ejercicio;

  @Column({ type: 'int' })
  dia: number;

  @Column({ type: 'int' })
  orden: number;

  @Column({ type: 'int' })
  series: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  peso?: number;

  @Column({ type: 'int', nullable: true })
  descanso?: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string;
}
