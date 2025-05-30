import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_membresia')
export class TipoMembresia {
  @PrimaryGeneratedColumn()
  id_tipo_membresia: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;
}
