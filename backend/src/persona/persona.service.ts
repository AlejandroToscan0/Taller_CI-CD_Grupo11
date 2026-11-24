import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto.js';
import { UpdatePersonaDto } from './dto/update-persona.dto.js';
import { Persona } from './entities/persona.entity.js';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto) {
    const persona = this.personaRepository.create(createPersonaDto);
    return this.guardar(persona);
  }

  findAll() {
    return this.personaRepository.find({ order: { apellidos: 'ASC' } });
  }

  async findOne(id: string) {
    const persona = await this.personaRepository.findOneBy({ id_persona: id });
    if (!persona) {
      throw new NotFoundException(`No existe la persona con id ${id}`);
    }
    return persona;
  }

  async update(id: string, updatePersonaDto: UpdatePersonaDto) {
    const persona = await this.findOne(id);
    this.personaRepository.merge(persona, updatePersonaDto);
    return this.guardar(persona);
  }

  async remove(id: string) {
    const persona = await this.findOne(id);
    await this.personaRepository.remove(persona);
    return { mensaje: `Persona ${id} eliminada` };
  }

  // si la identificacion ya existe PostgreSQL lanza el error 23505 (unique)
  private async guardar(persona: Persona) {
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      const codigo = (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code;
      if (error instanceof QueryFailedError && codigo === '23505') {
        throw new ConflictException(
          `Ya existe una persona con la identificacion ${persona.identificacion}`,
        );
      }
      throw error;
    }
  }
}
