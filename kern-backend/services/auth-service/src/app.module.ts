import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// TODO: Add auth logic here — Supabase JWT verification, profile sync
// Suggested modules to add:
//   - AuthModule (guards, strategies)
//   - ProfileModule (CRUD via Prisma)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
})
export class AppModule {}
