import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { SeatsModule } from './seats/seats.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ElasticModule } from './elasticsearch/elasticsearch.module';
import { CategoriesModule } from './categories/categories.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      extra: { max: 10, min: 2, idleTimeoutMillis: 30000 },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 1000,
        },
      ],
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('REDIS_URL'),
        options: {
          tls: {
            rejectUnauthorized: false,
          }
        }
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EventModule,
    SeatsModule,
    BookingsModule,
    PaymentsModule,
    CommonModule,
    UsersModule,
    RedisModule,
    ElasticModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },],
})
export class AppModule {
}
