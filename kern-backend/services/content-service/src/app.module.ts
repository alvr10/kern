import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// TODO: Add content logic here
// Suggested modules:
//   - ContentPiecesModule (Kanban/Calendar CRUD, status transitions via Mongoose)

@Controller('/content/health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'content-service', timestamp: new Date().toISOString() };
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
