// src/entities/tipo_especialidad.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipo_especialidad' })
export class TipoEspecialidad {
  @PrimaryGeneratedColumn({ name: 'id_tipo_especialidad' })
  id_tipo_especialidad: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  nombre: string;
}
