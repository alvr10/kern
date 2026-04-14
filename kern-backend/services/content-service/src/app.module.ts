import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, MetricsModule } from '@kern/shared';
import { DatabaseModule } from './infrastructure/database/database.module';

// TODO: Add content logic here
// ...
@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'content-service', timestamp: new Date().toISOString() };
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
