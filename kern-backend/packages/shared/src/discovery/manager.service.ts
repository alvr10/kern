import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceManager implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ServiceManager.name);
  private readonly serviceId: string;
  private readonly serviceName: string;
  private readonly serviceHost: string;
  private readonly servicePort: number;
  private readonly discoveryUrl: string;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor(private readonly config: ConfigService) {
    this.serviceId = this.config.get<string>('SERVICE_ID', `service-${Math.random().toString(36).substring(2, 11)}`);
    this.serviceName = this.config.get<string>('SERVICE_NAME', 'unknown-service');
    this.serviceHost = this.config.get<string>('SERVICE_HOST', 'localhost');
    this.servicePort = this.config.get<number>('PORT', 3000);
    this.discoveryUrl = this.config.get<string>('DISCOVERY_URL', 'http://api-gateway:3000/api/discovery');
  }

  async onModuleInit() {
    await this.register();
    this.startHeartbeat();
  }

  async onModuleDestroy() {
    this.stopHeartbeat();
    await this.deregister();
  }

  private async register(): Promise<void> {
    try {
      const response = await fetch(`${this.discoveryUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.serviceId,
          name: this.serviceName,
          host: this.serviceHost,
          port: this.servicePort,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);
      this.logger.log(`Registered ${this.serviceName} at ${this.discoveryUrl}`);
    } catch (e) {
      this.logger.error(`Registration failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  private async deregister(): Promise<void> {
    try {
      await fetch(`${this.discoveryUrl}/register/${this.serviceId}`, { method: 'DELETE' });
    } catch (e) {
      this.logger.error(`Deregistration failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => this.register(), 10000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }
}
