import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity.js';
import { PersonaService } from './persona.service.js';

describe('PersonaService', () => {
  let service: PersonaService;
  const repo = {
    create: vi.fn((dto) => dto),
    save: vi.fn(async (p) => ({ id_persona: 'uuid-1', estado: true, ...p })),
    find: vi.fn(async () => []),
    findOneBy: vi.fn(async () => null),
    merge: vi.fn((p, d) => Object.assign(p, d)),
    remove: vi.fn(async (p) => p),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonaService,
        { provide: getRepositoryToken(Persona), useValue: repo },
      ],
    }).compile();

    service = module.get<PersonaService>(PersonaService);
  });

  it('crea una persona', async () => {
    const creada = await service.create({
      nombres: 'Ana',
      apellidos: 'Perez',
      identificacion: '1712345678',
      correo: 'ana@example.com',
    });
    expect(creada.id_persona).toBe('uuid-1');
    expect(repo.save).toHaveBeenCalled();
  });

  it('lanza 404 si la persona no existe', async () => {
    await expect(service.findOne('no-existe')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
