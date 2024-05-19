import { Env } from '@/enums';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get(Env.DB_HOST),
        port: config.get(Env.DB_PORT),
        database: config.get(Env.DB_NAME),
        username: config.get(Env.DB_USERNAME),
        password: config.get(Env.DB_PASSWORD),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          sslmode: 'require',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
