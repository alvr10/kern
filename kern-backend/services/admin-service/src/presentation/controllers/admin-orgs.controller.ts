import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminSecretGuard } from '../../infrastructure/guards/admin-secret.guard';
import { OrganizationsClient } from '../../infrastructure/external-api/organizations.client';

@Controller('admin/organizations')
@UseGuards(AdminSecretGuard)
export class AdminOrgsController {
  constructor(private readonly orgsClient: OrganizationsClient) {}

  @Get()
  async list(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.orgsClient.listOrganizations(page, limit);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orgsClient.deleteOrganization(id);
  }
}
