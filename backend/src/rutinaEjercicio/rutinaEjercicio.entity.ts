// src/rutinas/entities/rutina-ejercicio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rutina } from '../entities/rutina.entity';
import { Ejercicio } from '../entities/ejercicio.entity';

@Entity('rutina_ejercicio')
export class RutinaEjercicio {
  @PrimaryGeneratedColumn({ name: 'id_rutina_ejercicio' })
  id_rutina_ejercicio: number; // mejor que sea igual al nombre DB

  @ManyToOne(() => Rutina, (rutina) => rutina.rutinaEjercicios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;

  @ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.rutinaEjercicios, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_ejercicio' })
  ejercicio: Ejercicio;

  @Column()
  dia: number;

  @Column()
  orden: number;

  @Column()
  series: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  peso?: number;

  @Column({ nullable: true })
  descanso?: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string;
}
