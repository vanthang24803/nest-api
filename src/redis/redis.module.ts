import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '@/enums';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        max: 1000,
        host: config.get(Env.REDIS_HOST),
        port: config.get(Env.REDIS_PORT),
        auth_pass: config.get(Env.REDIS_PASSWORD),
      }),
    }),
  ],
})
export class RedisModule {}
