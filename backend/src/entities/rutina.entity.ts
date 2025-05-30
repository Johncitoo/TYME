import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Ejercicio } from './ejercicio.entity'; // Si no tienes esta entidad aún, dímelo y te la hago.


@Entity('rutina')
export class Rutina {
  @PrimaryGeneratedColumn()
  id_rutina: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  estado: string;

  @ManyToOne(() => Cliente, cliente => cliente.id_cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  // Simula que tienes ejercicios relacionados (puedes omitir esto si no tienes esa relación aún)
  @OneToMany(() => Ejercicio, ejercicio => ejercicio.rutina)
  ejercicios: any[];
}
