import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clase')
export class Clase {
  @PrimaryGeneratedColumn()
  id_clase: number;

  @Column()
  nombre: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  hora_inicio: string; // o { type: 'time' } si prefieres

  @Column({ nullable: true })
  hora_fin: string; // o { type: 'time' } si prefieres

  @Column({ nullable: true })
  cupo_maximo: number;

  // Si tienes relación con entrenador, agrégala aquí
  // @ManyToOne(() => Entrenador)
  // @JoinColumn({ name: 'id_entrenador' })
  // entrenador: Entrenador;
}
