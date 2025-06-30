import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ejercicio } from './ejercicio.entity';

@Entity('tipo_ejercicio')
export class TipoEjercicio {
  @PrimaryGeneratedColumn({ name: 'id_tipo_ejercicio' })
  id_tipo_ejercicio: number;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Ejercicio, (ejercicio) => ejercicio.tipoEjercicio)
  ejercicios: Ejercicio[];
}
