import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Entrenador } from './entrenador.entity';
import { ClienteRutina } from './clienteRutina.entity';
import { RutinaEjercicio } from './rutinaEjercicio.entity';

@Entity('rutina')
export class Rutina {
  @PrimaryGeneratedColumn({ name: 'id_rutina' })
  id_rutina: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fecha_inicio: Date;

  /** FK a Entrenador */
  @ManyToOne(() => Entrenador, (entrenador) => entrenador.rutinas)
  @JoinColumn({ name: 'id_entrenador' })
  entrenador: Entrenador;

  /** Relación a clientes_rutinas */
  @OneToMany(() => ClienteRutina, (cr) => cr.rutina)
  clientesRutinas: ClienteRutina[];

  /** Relación a ejercicios de la rutina */
  @OneToMany(() => RutinaEjercicio, (re) => re.rutina, { cascade: true })
  rutinaEjercicios: RutinaEjercicio[];
}
