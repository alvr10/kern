import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/core-backend';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrganizationsModule } from './organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    DiscoveryClientModule,
    MetricsModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
