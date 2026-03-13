import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// TODO: Add AI logic here
// Suggested modules:
//   - GenerationsModule  (call OpenAI, stream responses, log to MongoDB)
//   - TokenUsageModule   (track token consumption per org, emit events when limits hit)

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'ai-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/kern'),
  ],
  controllers: [HealthController],
})
export class AppModule {}
