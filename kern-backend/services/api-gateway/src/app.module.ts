import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
})
export class AppModule {}
