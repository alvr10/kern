import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export abstract class BaseInternalClient {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly baseUrl: string,
  ) {}

  protected async get<T>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(`${this.baseUrl}${path}`, { params }));
      return data;
    } catch (error) {
      throw new Error(`Failed to call ${this.baseUrl}${path}: ${error.message}`);
    }
  }

  protected async post<T>(path: string, body?: any): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.httpService.post(`${this.baseUrl}${path}`, body));
      return data;
    } catch (error) {
      throw new Error(`Failed to call ${this.baseUrl}${path}: ${error.message}`);
    }
  }

  protected async patch<T>(path: string, body?: any): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.httpService.patch(`${this.baseUrl}${path}`, body));
      return data;
    } catch (error) {
      throw new Error(`Failed to call ${this.baseUrl}${path}: ${error.message}`);
    }
  }

  protected async delete<T>(path: string): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.httpService.delete(`${this.baseUrl}${path}`));
      return data;
    } catch (error) {
      throw new Error(`Failed to call ${this.baseUrl}${path}: ${error.message}`);
    }
  }
}
