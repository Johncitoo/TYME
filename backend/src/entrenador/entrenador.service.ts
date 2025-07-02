import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Entrenador } from '../entities/entrenador.entity';
import { TipoEspecialidad } from '../entities/tipo_especialidad.entity';

import { Usuario } from '../entities/user.entity';
import { EntrenadorTipo } from '../entities/entrenador_tipo.entity';
import { DtoCrearEntrenador as CrearEntrenadorDto } from './dto/dto-crear-entrenador';
@Injectable()
export class EntrenadorService {
  constructor(
    @InjectRepository(Entrenador)
    private readonly entrenadorRepo: Repository<Entrenador>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(EntrenadorTipo)
    private readonly entrenadorTipoRepo: Repository<EntrenadorTipo>,

    @InjectRepository(TipoEspecialidad)
    private readonly tipoEspecialidadRepo: Repository<TipoEspecialidad>,
  ) {}

  /**
   * Devuelve todos los entrenadores, cargando relaciones:
   * - usuario (datos personales)
   * - especialidades (cada registro enlaza con un TipoEspecialidad)
   */
  async findAll(): Promise<Entrenador[]> {
    return this.entrenadorRepo.find({
      relations: [
        'usuario',
        'especialidades',
        'especialidades.tipoEspecialidad',
      ],
    });
  }

  /**
   * Devuelve todos los tipos de especialidad disponibles,
   * para poblar el select en el front-end.
   */
  async findAllEspecialidades(): Promise<TipoEspecialidad[]> {
    return this.tipoEspecialidadRepo.find();
  }

  /**
   * Crea un nuevo entrenador:
   * 1) Primero crea un usuario con id_tipo_usuario = “entrenador” (3)
   * 2) Luego crea la fila en “entrenador” apuntando al id_usuario recién creado.
   * 3) Finalmente, relaciona tantas EntrenadorTipo como IDs de especialidad vengan en el DTO.
   */
  async create(dto: CrearEntrenadorDto): Promise<Entrenador> {
    // 1) Validaciones mínimas:
    //    a) Verificar que no exista un correo igual
    const existe = await this.usuarioRepo.findOne({
      where: { correo: dto.correo },
    });
    if (existe) {
      throw new BadRequestException('Ya existe un usuario con ese correo.');
    }

    //    b) Verificar que todas las especialidades enviadas existan
    const especialidadesEntidad = await this.tipoEspecialidadRepo.findBy({
      id_tipo_especialidad: In(dto.especialidades || []),
    });
    if (
      dto.especialidades &&
      especialidadesEntidad.length !== dto.especialidades.length
    ) {
      throw new BadRequestException(
        'Alguna de las especialidades enviadas no existe.',
      );
    }

    // 2) Crear el usuario (tipo_usuario = 3 → “entrenador”)
    const nuevoUsuario = this.usuarioRepo.create({
      id_tipo_usuario: 3, // 3 = “entrenador” según tu lookup
      correo: dto.correo,
      contrasena: dto.contrasena,
      primer_nombre: dto.primer_nombre,
      segundo_nombre: dto.segundo_nombre,
      primer_apellido: dto.primer_apellido,
      segundo_apellido: dto.segundo_apellido,
      telefono: dto.telefono,
      cuerpo_rut: dto.cuerpo_rut,
      dv_rut: dto.dv_rut,
      direccion: dto.direccion,
      fecha_nacimiento: dto.fecha_nacimiento,
      id_tipo_genero: dto.id_tipo_genero,
      id_tipo_sexo: dto.id_tipo_sexo,
      id_contacto_emergencia: dto.id_contacto_emergencia,
    });
    const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

    // 3) Crear el registro en “entrenador” apuntando al usuario recién guardado
    const nuevoEntrenador = this.entrenadorRepo.create({
      usuario: usuarioGuardado,
    });
    const entrenadorGuardado = await this.entrenadorRepo.save(nuevoEntrenador);

    // 4) Crear las filas en “entrenador_tipo” para cada especialidad
    if (dto.especialidades && dto.especialidades.length > 0) {
      const listaEntrenadorTipo: EntrenadorTipo[] = dto.especialidades.map(
        (idEsp) =>
          this.entrenadorTipoRepo.create({
            entrenador: entrenadorGuardado,
            tipoEspecialidad: especialidadesEntidad.find(
              (e) => e.id_tipo_especialidad === idEsp,
            ),
          }),
      );
      await this.entrenadorTipoRepo.save(listaEntrenadorTipo);
    }

    // 5) Finalmente devolvemos el entrenador completo, incluyendo sus especialidades
    const result = await this.entrenadorRepo.findOne({
      where: { id_entrenador: entrenadorGuardado.id_entrenador },
      relations: [
        'usuario',
        'especialidades',
        'especialidades.tipoEspecialidad',
      ],
    });
    if (!result) {
      throw new BadRequestException('No se pudo crear el entrenador');
    }
    return result;
  }

  async findAllActivos(): Promise<Entrenador[]> {
  return this.entrenadorRepo.find({
    where: { usuario: { activo: true } },
    relations: [
      'usuario',
      'especialidades',
      'especialidades.tipoEspecialidad',
    ],
  });
}

}
