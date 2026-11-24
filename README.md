# Sistema de Banca Móvil

![CI-CD](https://github.com/AlejandroToscan0/Taller_CI-CD_Grupo11/actions/workflows/ci-cd.yml/badge.svg?branch=desarrollo)

Laboratorio de CI/CD de la materia Construcción y Evolución del Software (Grupo 11).

## Ramas

- `master`: versión estable
- `pruebas`: integración y pruebas
- `desarrollo`: trabajo diario

## Flujo de CI/CD

El archivo `.github/workflows/ci-cd.yml` corre en GitHub Actions:

1. En cada push a `desarrollo`, `pruebas` o `master` y en cada pull request hacia `pruebas` o `master`.
2. Levanta un PostgreSQL 17 temporal, instala dependencias con `npm ci` y ejecuta lint, compilación, pruebas unitarias y pruebas e2e del CRUD de persona.
3. Solo cuando el push es a `master` guarda el compilado (`backend-dist`) y ejecuta el job de entrega.

El camino de un cambio es `desarrollo` → pull request a `pruebas` → pull request a `master`. Un pull request solo se puede unir si el pipeline pasa.

## Estructura

```
.github/workflows/    pipeline de CI/CD
backend/              API REST en NestJS (CRUD de persona)
database/01_schema.sql  esquema exportado con pg_dump
docker-compose.yml    contenedor de PostgreSQL 17
.env                  contraseña local (no se sube a Git)
```

## Base de datos

Crear el archivo `.env` en la raíz con:

```
POSTGRES_PASSWORD=tu_contraseña
```

Luego:

```bash
docker compose up -d
docker compose exec postgres psql -U bancamovil -d bancamovil_db
```

El contenedor se llama `bancamovil-postgres` y escucha en el puerto `5434`.

## Credenciales provisionales

| Rol | Email | Contraseña |
|-----|-------|------------|
| Operador | admin@example.com | Admin12345 |
| Cliente | cliente@example.com | Cliente123 |
