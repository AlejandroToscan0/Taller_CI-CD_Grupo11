# Backend - Banca Móvil

API REST hecha con NestJS y TypeORM. Por ahora tiene el CRUD de `persona`.

## Ejecutar

Primero levantar PostgreSQL desde la raíz del repositorio (`docker compose up -d`). Luego:

```bash
cd backend
npm install
npm run start:dev
```

La API queda en `http://localhost:3000`. La contraseña de la base se lee del `.env` de la raíz.

## Rutas de persona

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /persona | Crea una persona |
| GET | /persona | Lista las personas |
| GET | /persona/:id | Busca una persona por su UUID |
| PATCH | /persona/:id | Actualiza uno o varios campos |
| DELETE | /persona/:id | Elimina la persona |

## Pruebas unitarias

```bash
npm test
```
