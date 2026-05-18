import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryClientModule, LoggerModule, MetricsModule } from '@kern/core-backend';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, DiscoveryClientModule, MetricsModule],
  controllers: [HealthController],
})
export class AppModule {}
