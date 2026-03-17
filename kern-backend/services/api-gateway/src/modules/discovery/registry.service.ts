import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ServiceInstance {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'HEALTHY' | 'UNHEALTHY';
  lastHeartbeat: number;
}

@Injectable()
export class RegistryService implements OnModuleInit {
  private readonly logger = new Logger(RegistryService.name);
  private services: Map<string, ServiceInstance> = new Map();
  private readonly ttl: number;

  constructor(private readonly config: ConfigService) {
    this.ttl = this.config.get<number>('DISCOVERY_TTL', 15000);
  }

  onModuleInit() {
    this.startCleanupTask();
  }

  public register(instance: Omit<ServiceInstance, 'status' | 'lastHeartbeat'>): void {
    this.services.set(instance.id, {
      ...instance,
      status: 'HEALTHY',
      lastHeartbeat: Date.now(),
    });
    this.logger.log(`Registered: ${instance.name} (${instance.id}) at ${instance.host}:${instance.port}`);
  }

  public deregister(id: string): void {
    this.services.delete(id);
    this.logger.log(`Deregistered: ${id}`);
  }

  public getAll(): ServiceInstance[] {
    return Array.from(this.services.values());
  }

  public getByName(name: string): ServiceInstance[] {
    return this.getAll().filter((s) => s.name === name && s.status === 'HEALTHY');
  }

  private startCleanupTask(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [id, instance] of this.services.entries()) {
        if (now - instance.lastHeartbeat > this.ttl) {
          this.logger.warn(`Service ${instance.name} (${id}) lost heartbeat. Deregistering.`);
          this.deregister(id);
        }
      }
    }, this.ttl / 2);
  }
}
