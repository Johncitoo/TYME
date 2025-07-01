import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Boleta } from '/entities/boleta.entity';

@Entity({ name: 'tipo_metodo_pago' })
export class TipoMetodoPago {
  @PrimaryGeneratedColumn({ name: 'id_metodo' })
  id_metodo: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => Boleta, (boleta) => boleta.metodo_pago)
  boletas: Boleta[];
}
