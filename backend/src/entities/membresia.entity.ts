import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'membresia' })
export class Membresia {
  @PrimaryGeneratedColumn()
  id_membresia: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'numeric' })
  precio: number;

  @Column()
  duracion_dias: number;
}
