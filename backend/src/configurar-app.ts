import { INestApplication, ValidationPipe } from '@nestjs/common';

// Configuracion comun de la app. La usan main.ts y las pruebas e2e
// para que las validaciones sean las mismas en los dos casos.
export function configurarApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  return app;
}
