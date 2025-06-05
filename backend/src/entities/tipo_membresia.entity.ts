// src/entities/tipo_membresia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipo_membresia' })
export class TipoMembresia {
  @PrimaryGeneratedColumn({ name: 'id_tipo_membresia' })
  id_tipo_membresia: number;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ type: 'text', default: '' })
  descripcion: string;
}
