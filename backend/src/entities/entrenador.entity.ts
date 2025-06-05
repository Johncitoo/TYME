// src/entities/entrenador.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './user.entity';
import { EntrenadorTipo } from './entrenador_tipo.entity';

@Entity({ name: 'entrenador' })
export class Entrenador {
  @PrimaryGeneratedColumn({ name: 'id_entrenador' })
  id_entrenador: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  /**
   * Relación uno-a-muchos con EntrenadorTipo.
   * Cada entrenador puede tener varias filas en entrenador_tipo.
   */
  @OneToMany(() => EntrenadorTipo, (et) => et.entrenador, {
    cascade: true,
    eager: true,
  })
  especialidades: EntrenadorTipo[];
}
