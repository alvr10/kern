import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// TODO: Add projects logic here
// Suggested modules:
//   - ProjectsModule (CRUD via Prisma — ties to Organization)

@Controller('/projects/health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'projects-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
})
export class AppModule {}
