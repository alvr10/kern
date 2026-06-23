import { Controller, Get, Param, Patch, Query, UseGuards, Body } from '@nestjs/common';
import { AdminSecretGuard } from '../../infrastructure/guards/admin-secret.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('admin/users')
@UseGuards(AdminSecretGuard)
export class AdminUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query('page') page = 1, @Query('limit') limit = 50) {
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, createdAt: true },
      }),
      this.prisma.profile.count(),
    ]);
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: string, @Body('banned') banned: boolean) {
    // Banning is managed via Supabase auth — stub response for now
    return { id, banned, status: 'updated' };
  }
}
