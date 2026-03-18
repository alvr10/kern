import { Module, MiddlewareConsumer, NestModule, Inject } from '@nestjs/common';
import { ConsulService } from '@kern/shared';
import { createProxyMiddleware } from 'http-proxy-middleware';

const ROUTE_TO_SERVICE: Record<string, string> = {
  '/auth': 'auth-service',
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
  constructor(private readonly consulService: ConsulService) { }

  configure(consumer: MiddlewareConsumer) {
    for (const [prefix, serviceName] of Object.entries(ROUTE_TO_SERVICE)) {
      consumer.apply(
        async (req, res, next) => {
          // Resolve target from registry at request time
          const instances = await this.consulService.resolve(serviceName);
          if (!instances.length) {
            res.status(503).json({ error: `${serviceName} unavailable` });
            return;
          }
          // Round-robin load balancing across healthy instances
          const instance = instances[Math.floor(Math.random() * instances.length)];
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
        }
      ).forRoutes(prefix);
    }
  }
}