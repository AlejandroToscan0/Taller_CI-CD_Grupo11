import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PersonaModule } from './persona/persona.module.js';

@Module({
  imports: [
    // el .env esta en la raiz del repositorio (un nivel arriba de backend)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    // conexion al PostgreSQL que levanta docker-compose (puerto 5434)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5434)),
        username: config.get<string>('DB_USER', 'bancamovil'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('DB_NAME', 'bancamovil_db'),
        autoLoadEntities: true,
        // las tablas ya se crearon con el script SQL, por eso no se sincroniza
        synchronize: false,
      }),
    }),
    PersonaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
