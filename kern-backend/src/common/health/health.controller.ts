import { PrismaService } from "@/database/postgres/prisma.service";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from "@nestjs/terminus";

@ApiTags("Health")
@Public()
@Controller({ path: "health", version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
    private memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Check API health status" })
  @ApiResponse({ status: 200, description: "API and DB are healthy" })
  @ApiResponse({ status: 503, description: "Service unavailable" })
  check() {
    return this.health.check([
      () => this.db.pingCheck("database", this.prisma),
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024), // 300MB
    ]);
  }
}
