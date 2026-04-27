import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AIModule } from './ai.module';
import { HealthController } from './presentation/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    DiscoveryClientModule,
    MetricsModule,
    AIModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
