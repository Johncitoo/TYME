import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TipoGrupoMuscular } from './tipoGrupoMuscular.entity';
import { TipoEjercicio } from './tipoEjercicio.entity';
import { RutinaEjercicio } from './rutinaEjercicio.entity';

@Entity('ejercicio')
export class Ejercicio {
  @PrimaryGeneratedColumn({ name: 'id_ejercicio' })
  id_ejercicio: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'text', name: 'video_url', nullable: true })
  video_url?: string;

  @Column({ type: 'text', name: 'imagen_url', nullable: true })
  imagen_url?: string;

  @ManyToOne(() => TipoGrupoMuscular, (grupo) => grupo.ejercicios, {
    eager: true,
  })
  @JoinColumn({ name: 'id_grupo_muscular' })
  grupoMuscular: TipoGrupoMuscular;

  @ManyToOne(() => TipoEjercicio, (tipo) => tipo.ejercicios, { eager: true })
  @JoinColumn({ name: 'id_tipo_ejercicio' })
  tipoEjercicio: TipoEjercicio;

  @OneToMany(() => RutinaEjercicio, (re) => re.ejercicio)
  rutinaEjercicios: RutinaEjercicio[];
}
