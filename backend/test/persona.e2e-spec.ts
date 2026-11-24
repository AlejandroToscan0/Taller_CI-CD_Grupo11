import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module.js';
import { configurarApp } from './../src/configurar-app.js';

// Necesita PostgreSQL con el esquema de database/01_schema.sql
describe('Persona (e2e)', () => {
  let app: INestApplication<App>;
  let id: string;

  const persona = {
    nombres: 'Ana',
    apellidos: 'Perez',
    identificacion: 'E2E-0001',
    correo: 'ana.e2e@example.com',
    telefono: '0991234567',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configurarApp(moduleFixture.createNestApplication());
    await app.init();
    // se limpia lo que haya quedado de una corrida anterior
    await app
      .get(DataSource)
      .query('DELETE FROM persona WHERE identificacion LIKE $1', ['E2E-%']);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('POST /persona crea la persona (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/persona')
      .send(persona)
      .expect(201);
    expect(res.body.id_persona).toBeDefined();
    expect(res.body.estado).toBe(true);
    id = res.body.id_persona;
  });

  it('GET /persona la incluye en la lista (200)', async () => {
    const res = await request(app.getHttpServer()).get('/persona').expect(200);
    expect(
      res.body.some((p: { id_persona: string }) => p.id_persona === id),
    ).toBe(true);
  });

  it('PATCH /persona/:id cambia el telefono (200)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/persona/${id}`)
      .send({ telefono: '0987654321' })
      .expect(200);
    expect(res.body.telefono).toBe('0987654321');
  });

  it('POST con identificacion repetida responde 409', () => {
    return request(app.getHttpServer())
      .post('/persona')
      .send(persona)
      .expect(409);
  });

  it('POST con correo invalido responde 400', () => {
    return request(app.getHttpServer())
      .post('/persona')
      .send({
        ...persona,
        identificacion: 'E2E-0002',
        correo: 'correo-invalido',
      })
      .expect(400);
  });

  it('DELETE /persona/:id y luego GET responde 404', async () => {
    await request(app.getHttpServer()).delete(`/persona/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/persona/${id}`).expect(404);
  });
});
