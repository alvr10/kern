import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// TODO: Add organizations logic here
// Suggested modules:
//   - OrganizationsModule (CRUD, membership management via Prisma)
//   - InvitationsModule (invite flow)

@Controller('/organizations/health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'organizations-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
})
export class AppModule {}
