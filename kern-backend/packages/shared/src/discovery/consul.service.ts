import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Consul from 'consul';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ConsulService.name);
  private readonly consul: Consul;
  private readonly serviceId: string;
  private readonly serviceName: string;
  private readonly servicePort: number;

  constructor(private readonly config: ConfigService) {
    const consulUrlStr = this.config.get<string>('CONSUL_URL', 'http://consul:8500');
    const consulUrl = new URL(consulUrlStr);
    
    this.consul = new Consul({
      host: consulUrl.hostname,
      port: Number(consulUrl.port || '8500'),
    });
    
    this.serviceName = this.config.get<string>('SERVICE_NAME', 'unknown');
    this.servicePort = Number(this.config.get<number>('PORT', 3000));
    this.serviceId = `${this.serviceName}-${process.pid}`;
  }

  async onModuleInit(): Promise<void> {
    await this.register();
  }

  async onModuleDestroy(): Promise<void> {
    await this.deregister();
  }

  private async register(): Promise<void> {
    const registration = {
      id: this.serviceId,
      name: this.serviceName,
      address: this.serviceName,
      port: this.servicePort,
      check: {
        name: `Health check for ${this.serviceName}`,
        http: `http://${this.serviceName}:${this.servicePort}/health`,
        interval: '10s',
        timeout: '5s',
        deregistercriticalserviceafter: '30s',
      },
      meta: {
        metrics_path: '/metrics',
      },
    };

    try {
      await this.consul.agent.service.register(registration);
      this.logger.log(`Registered ${this.serviceName} with Consul`);
    } catch (e: any) {
      this.logger.error(`Consul registration failed: ${e.message}`);
      setTimeout(() => this.register(), 5000);
    }
  }

  private async deregister(): Promise<void> {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      this.logger.log(`Deregistered ${this.serviceName} from Consul`);
    } catch (e: any) {
      this.logger.error(`Consul deregistration failed: ${e.message}`);
    }
  }

  async resolve(serviceName: string): Promise<{ host: string; port: number }[]> {
    try {
      const results: any[] = await (this.consul.health.service as any)({
        service: serviceName,
        passing: true,
      });

      return results.map((entry: any) => ({
        host: entry.Service.Address || serviceName,
        port: entry.Service.Port,
      }));
    } catch (e: any) {
      this.logger.error(`Failed to resolve service ${serviceName}: ${e.message}`);
      return [];
    }
  }
}