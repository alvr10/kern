import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConsulService } from '@kern/shared';
import { createProxyMiddleware } from 'http-proxy-middleware';

const ROUTE_TO_SERVICE: Record<string, string> = {
  '/organizations': 'organizations-service',
  '/projects': 'projects-service',
  '/content': 'content-service',
  '/social': 'social-service',
  '/notifications': 'notifications-service',
  '/billing': 'billing-service',
  '/ai': 'ai-service',
  '/admin': 'admin-service',
};

@Module({})
export class ProxyModule implements NestModule {
  private readonly serviceIndices: Map<string, number> = new Map();

  constructor(private readonly consulService: ConsulService) {}

  configure(consumer: MiddlewareConsumer) {
    for (const [prefix, serviceName] of Object.entries(ROUTE_TO_SERVICE)) {
      consumer
        .apply(async (req, res, next) => {
          // Resolve target from registry at request time
          const instances = await this.consulService.resolve(serviceName);
          if (!instances || !instances.length) {
            res.status(503).json({ error: `${serviceName} unavailable` });
            return;
          }

          // Round-robin load balancing across healthy instances
          const currentIndex = this.serviceIndices.get(serviceName) || 0;
          const nextIndex = (currentIndex + 1) % instances.length;
          this.serviceIndices.set(serviceName, nextIndex);

          const instance = instances[currentIndex % instances.length];
          const target = `http://${instance.host}:${instance.port}`;

          createProxyMiddleware({
            target,
            changeOrigin: true,
            on: {
              error: (err, _req, res: any) => {
                res.status(502).json({ error: 'Service unavailable', detail: err.message });
              },
            },
          })(req, res, next);
        })
        .forRoutes(prefix);
    }
  }
}
