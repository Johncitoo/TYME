// src/entities/entrenador_tipo.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Entrenador } from './entrenador.entity';
import { TipoEspecialidad } from './tipo_especialidad.entity';

@Entity({ name: 'entrenador_tipo' })
export class EntrenadorTipo {
  @PrimaryGeneratedColumn({ name: 'id_entrenador_tipo' })
  id_entrenador_tipo: number;

  // FK a entrenador(id_entrenador)
  @ManyToOne(() => Entrenador, (ent) => ent.especialidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entrenador' })
  entrenador: Entrenador;

  // FK a tipo_especialidad(id_tipo_especialidad)
  @ManyToOne(() => TipoEspecialidad, { eager: true })
  @JoinColumn({ name: 'id_tipo_especialidad' })
  tipoEspecialidad: TipoEspecialidad;
}
