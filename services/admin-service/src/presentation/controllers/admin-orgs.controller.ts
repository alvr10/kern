import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminSecretGuard } from '../../infrastructure/guards/admin-secret.guard';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('admin/organizations')
@UseGuards(AdminSecretGuard)
export class AdminOrgsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query('page') page = 1, @Query('limit') limit = 50) {
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take: Number(limit),
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, slug: true, createdAt: true },
      }),
      this.prisma.organization.count({ where: { deletedAt: null } }),
    ]);
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { id, deleted: true };
  }
}
