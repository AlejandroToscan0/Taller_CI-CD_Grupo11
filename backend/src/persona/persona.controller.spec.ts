import { Test, TestingModule } from '@nestjs/testing';
import { PersonaController } from './persona.controller.js';
import { PersonaService } from './persona.service.js';

describe('PersonaController', () => {
  let controller: PersonaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonaController],
      providers: [{ provide: PersonaService, useValue: { findAll: vi.fn(() => []) } }],
    }).compile();

    controller = module.get<PersonaController>(PersonaController);
  });

  it('lista las personas', () => {
    expect(controller.findAll()).toEqual([]);
  });
});
