import { Controller, Get, Param, Patch, Query, UseGuards, Body } from '@nestjs/common';
import { AdminSecretGuard } from '../../infrastructure/guards/admin-secret.guard';
import { OrganizationsClient } from '../../infrastructure/external-api/organizations.client';

@Controller('admin/users')
@UseGuards(AdminSecretGuard)
export class AdminUsersController {
  constructor(private readonly orgsClient: OrganizationsClient) {}

  @Get()
  async list(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.orgsClient.listUsers(page, limit);
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: string, @Body('banned') banned: boolean) {
    // In a real scenario, this would be a PATCH to organizations-service
    return { id, banned, status: 'updated' };
  }
}
