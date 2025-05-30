import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('membresia')
export class Membresia {
  @PrimaryGeneratedColumn()
  id_membresia: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column('numeric')
  precio: number;

  @Column()
  duracion_dias: number;
}
