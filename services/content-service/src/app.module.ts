import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/core-backend';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ContentModule } from './content.module';
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
    ContentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
