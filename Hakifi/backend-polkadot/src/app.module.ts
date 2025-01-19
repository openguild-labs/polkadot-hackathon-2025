import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InsurancesModule } from './insurances/insurances.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import config from './configs/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PairsModule } from './pairs/pairs.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Config } from './configs/config.interface';
import { GeneralModule } from './general/general.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { PriceModule } from './price/price.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionsModule } from './transactions/transactions.module';
import { CommissionModule } from './commission/commission.module';
import { CommandModule } from 'nestjs-command';
import { WalletModule } from './wallet/wallet.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService<Config>) => ({
        store: redisStore,
        url: configService.get<string>('redisUrl'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          // loggingMiddleware({
          //   logger: new Logger('PrismaMiddleware'),
          //   logLevel: 'log',
          // }),
        ],
      },
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        url: configService.get<string>('redisUrl'),
        defaultJobOptions: {
          removeOnComplete: true,
        },
        prefix: 'hakifi-be'
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot(),
    AuthModule,
    SocketModule,
    InsurancesModule,
    UsersModule,
    TokensModule,
    PairsModule,
    GeneralModule,
    HealthModule,
    PriceModule,
    TransactionsModule,
    CommissionModule,
    CommandModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
