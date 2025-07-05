import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Boleta } from './boleta.entity';
@Entity({ name: 'membresia' })
export class Membresia {
  @PrimaryGeneratedColumn({ name: 'id_membresia' })
  id_membresia: number;

  @Column()
  nombre: string;

  // Permitimos que la descripción sea opcional
  @Column({ nullable: true })
  descripcion?: string;

  // Definimos el precio como tipo numeric
  @Column({ type: 'numeric' })
  precio: number;

  @Column({ name: 'duracion_dias' })
  duracion_dias: number;

  @OneToMany(() => Boleta, (boleta) => boleta.membresia)
  boletas: Boleta[];
}
