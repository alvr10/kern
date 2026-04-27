import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';
import { SocialModule } from './social.module';
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
    SocialModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
