import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('organizations')
  async listOrganizations(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
      }),
      this.prisma.organization.count({ where: { deletedAt: null } }),
    ]);

    return { data, total };
  }

  @Get('users')
  async listUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
      }),
      this.prisma.profile.count(),
    ]);

    return { data, total };
  }
}
