import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseInternalClient } from './base-internal.client';

@Injectable()
export class AIClient extends BaseInternalClient {
  constructor(httpService: HttpService, configService: ConfigService) {
    super(httpService, configService.get<string>('AI_SERVICE_URL') || 'http://localhost:3008');
  }

  async getTokenUsageStats() {
    return this.get('/admin/stats');
  }
}
