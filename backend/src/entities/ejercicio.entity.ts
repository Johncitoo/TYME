import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rutina } from './rutina.entity';

@Entity('ejercicio')
export class Ejercicio {
  @PrimaryGeneratedColumn()
  id_ejercicio: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // Puedes agregar más columnas según tu base de datos: repeticiones, series, peso, etc.

  // Relación: cada ejercicio pertenece a una rutina
  @ManyToOne(() => Rutina, rutina => rutina.id_rutina)
  @JoinColumn({ name: 'id_rutina' })
  rutina: Rutina;
}
