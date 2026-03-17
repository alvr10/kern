import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { LoggerModule } from '@kern/shared';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, DiscoveryModule],
  controllers: [HealthController],
})
export class AppModule {}
