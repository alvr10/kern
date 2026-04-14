import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';

// ─── Admin Routes (stub — implement each as its own module) ──────────────────
// GET  /admin/health            → this controller
// GET  /admin/users             → list all profiles
// GET  /admin/users/:id         → profile detail + memberships
// PATCH /admin/users/:id/ban   → deactivate user
// GET  /admin/organizations     → all orgs with stats
// DELETE /admin/organizations/:id
// GET  /admin/content           → all content pieces (moderation)
// GET  /admin/billing/plans     → plan management
// GET  /admin/billing/subscriptions
// GET  /admin/analytics/overview → KPIs: MAU, content, tokens, revenue
// GET  /admin/analytics/tokens   → per-org token usage
// GET  /admin/system/health      → aggregate health of all services

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'admin-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DiscoveryClientModule,
    MetricsModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
