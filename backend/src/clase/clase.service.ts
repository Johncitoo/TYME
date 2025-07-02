import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './clase.entity';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { Entrenador } from '../entities/entrenador.entity';
import { Usuario } from '../entities/user.entity';
import { Asistencia } from '../asistencia/asistencia.entity';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Entrenador)
    private readonly entrenadorRepository: Repository<Entrenador>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}

  async create(createClaseDto: CreateClaseDto): Promise<Clase> {
    // Validar horas
    if (createClaseDto.hora_inicio >= createClaseDto.hora_fin) {
      throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin.');
    }

    // Validar cupo
    if (!Number.isInteger(createClaseDto.cupo_maximo) || createClaseDto.cupo_maximo <= 0) {
      throw new BadRequestException('El cupo máximo debe ser un número entero positivo.');
    }

    // Buscar entrenador activo
    const entrenador = await this.entrenadorRepository.findOne({
      where: { id_entrenador: createClaseDto.id_entrenador, usuario: { activo: true } },
      relations: ['usuario'],
    });
    if (!entrenador) throw new NotFoundException('Entrenador no encontrado o inactivo.');

    // Crear clase
    const clase = this.claseRepository.create({
      ...createClaseDto,
      entrenador,
    });
    return await this.claseRepository.save(clase);
  }

  findAll(): Promise<Clase[]> {
    return this.claseRepository.find();
  }

  async findOne(id: number): Promise<Clase> {
    const clase = await this.claseRepository.findOne({ where: { id_clase: id } });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

  async update(id: number, updateClaseDto: UpdateClaseDto): Promise<Clase> {
    await this.claseRepository.update(id, updateClaseDto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const clase = await this.findOne(id);
    await this.claseRepository.remove(clase);
  }

  async findClasesInscritasSemana(clienteId: number): Promise<Clase[]> {
    const asistencias = await this.asistenciaRepository.find({
      where: { cliente: { id_cliente: clienteId } },
      relations: ['clase', 'clase.entrenador', 'clase.entrenador.usuario'],
    });

    const ahora = new Date();
    const clasesInscritas: Clase[] = asistencias
      .map((a) => a.clase)
      .filter((c): c is Clase => !!c)
      .filter((c) => new Date(`${c.fecha_clase}T${c.hora_fin}`) > ahora)
      .sort((a, b) => {
        const aDate = new Date(`${a.fecha_clase}T${a.hora_inicio}`);
        const bDate = new Date(`${b.fecha_clase}T${b.hora_inicio}`);
        return aDate.getTime() - bDate.getTime();
      });

    return clasesInscritas;
  }
}
