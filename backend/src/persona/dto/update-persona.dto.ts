import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto.js';

// en el PATCH todos los campos son opcionales
export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {}
