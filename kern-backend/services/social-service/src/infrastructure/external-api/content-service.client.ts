import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentServiceClient {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Default to localhost:3004 if not configured
    this.baseUrl = this.configService.get<string>('CONTENT_SERVICE_URL') || 'http://localhost:3004';
  }

  async getContentPiece(id: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(`${this.baseUrl}/content/${id}`));
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch content piece ${id}: ${error.message}`, { cause: error });
    }
  }
}
