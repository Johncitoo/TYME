// src/entities/cliente.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuario } from './user.entity';
import { TipoMembresia } from './tipo_membresia.entity';
import { Entrenador } from './entrenador.entity';

@Entity({ name: 'cliente' })
@Unique(['usuario'])
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  id_cliente: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => TipoMembresia, { eager: true })
  @JoinColumn({ name: 'id_tipo_membresia' })
  tipoMembresia: TipoMembresia;

  @ManyToOne(() => Entrenador, { eager: true })
  @JoinColumn({ name: 'id_entrenador' })
  entrenador: Entrenador;
  // Si después quieres agregar entrenador, aquí puedes ponerlo como ManyToOne también.
}
