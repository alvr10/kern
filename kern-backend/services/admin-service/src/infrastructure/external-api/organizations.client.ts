import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseInternalClient } from './base-internal.client';

@Injectable()
export class OrganizationsClient extends BaseInternalClient {
  constructor(httpService: HttpService, configService: ConfigService) {
    super(httpService, configService.get<string>('ORGANIZATIONS_SERVICE_URL') || 'http://localhost:3002');
  }

  async listUsers(page: number, limit: number) {
    return this.get('/admin/users', { page, limit });
  }

  async listOrganizations(page: number, limit: number) {
    return this.get('/admin/organizations', { page, limit });
  }

  async deleteOrganization(id: string) {
    return this.delete(`/organizations/${id}`);
  }
}
