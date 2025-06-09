import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from '/entities/membresia.entity';

@Injectable()
export class MembresiaService {
  constructor(
    @InjectRepository(Membresia)
    private membresiaRepository: Repository<Membresia>,
  ) {}

  async findAll(): Promise<Membresia[]> {
    return this.membresiaRepository.find();
  }

  /**
   * Crea una nueva membresía.
   * Si el nombre ya existe, lanza un BadRequestException.
   */
  async create(data: {
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion_dias: number;
  }): Promise<Membresia> {
    // 1) Verificar que no exista un plan con el mismo nombre
    const existe = await this.membresiaRepository.findOne({
      where: { nombre: data.nombre },
    });
    if (existe) {
      throw new BadRequestException('Ya existe un plan con ese nombre.');
    }

    // 2) Crear la entidad y guardar
    const nueva = this.membresiaRepository.create({
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio: data.precio,
      duracion_dias: data.duracion_dias,
    });

    return this.membresiaRepository.save(nueva);
  }

  /**
   * (Opcional) Obtener un solo plan por su ID.
   */
  async findOne(id: number): Promise<Membresia> {
    const plan = await this.membresiaRepository.findOne({
      where: { id_membresia: id },
    });
    if (!plan) {
      throw new NotFoundException(`No se encontró un plan con id ${id}`);
    }
    return plan;
  }

  /**
   * (Opcional) Actualizar un plan existente.
   */
  async update(
    id: number,
    cambios: Partial<{
      nombre: string;
      descripcion: string;
      precio: number;
      duracion_dias: number;
    }>,
  ): Promise<Membresia> {
    const plan = await this.findOne(id);
    Object.assign(plan, cambios);
    return this.membresiaRepository.save(plan);
  }

  /**
   * (Opcional) Eliminar un plan por ID.
   */
  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    await this.membresiaRepository.remove(plan);
  }
}
