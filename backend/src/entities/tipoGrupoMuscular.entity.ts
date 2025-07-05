import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ejercicio } from './ejercicio.entity';

@Entity('tipo_grupo_muscular')
export class TipoGrupoMuscular {
  @PrimaryGeneratedColumn({ name: 'id_grupo_muscular' })
  id_grupo_muscular: number;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Ejercicio, (ejercicio) => ejercicio.grupoMuscular)
  ejercicios: Ejercicio[];
}
