import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule } from '@kern/shared';

// TODO: Add organizations logic here
// Suggested modules:
//   - OrganizationsModule (CRUD, membership management via Prisma)
//   - InvitationsModule (invite flow)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'organizations-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DiscoveryClientModule],
  controllers: [HealthController],
})
export class AppModule { }
