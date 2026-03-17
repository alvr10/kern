import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule } from '@kern/shared';

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
  imports: [ConfigModule.forRoot({ isGlobal: true }), DiscoveryClientModule],
  controllers: [HealthController],
})
export class AppModule { }
