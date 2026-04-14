import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';

// TODO: Add projects logic here
// Suggested modules:
//   - ProjectsModule (CRUD via Prisma — ties to Organization)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'projects-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, DiscoveryClientModule, MetricsModule],
  controllers: [HealthController],
})
export class AppModule { }
