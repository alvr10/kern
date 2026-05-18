import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseInternalClient } from './base-internal.client';

@Injectable()
export class ContentClient extends BaseInternalClient {
  constructor(httpService: HttpService, configService: ConfigService) {
    super(httpService, configService.get<string>('CONTENT_SERVICE_URL') || 'http://localhost:3004');
  }

  async countAll() {
    return this.get<number>('/admin/stats');
  }
}
