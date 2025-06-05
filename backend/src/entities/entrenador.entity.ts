// src/entities/entrenador.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './user.entity';

@Entity({ name: 'entrenador' })
export class Entrenador {
  @PrimaryGeneratedColumn({ name: 'id_entrenador' })
  id_entrenador: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
