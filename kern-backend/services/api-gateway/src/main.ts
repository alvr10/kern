import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Map of route prefixes → upstream service URLs (internal Docker network)
const ROUTES: Record<string, string> = {
  '/auth': 'http://auth-service:3001',
  '/organizations': 'http://organizations-service:3002',
  '/projects': 'http://projects-service:3003',
  '/content': 'http://content-service:3004',
  '/social': 'http://social-service:3005',
  '/notifications': 'http://notifications-service:3006',
  '/billing': 'http://billing-service:3007',
  '/ai': 'http://ai-service:3008',
  '/admin': 'http://admin-service:3009',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.enableCors();

  // Access the underlying Express instance to register proxy middleware
  const express = app.getHttpAdapter().getInstance();

  for (const [prefix, target] of Object.entries(ROUTES)) {
    express.use(
      prefix,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        // Forward the original prefix as-is so services can mount their own routes
        on: {
          error: (err, _req, res: any) => {
            res.status(502).json({ error: 'Service unavailable', detail: err.message });
          },
        },
      }),
    );
  }

  await app.listen(3000);
  console.log('[api-gateway] 🚀  Listening on http://localhost:3000');
  for (const [p, t] of Object.entries(ROUTES)) {
    console.log(`  ${p} → ${t}`);
  }
}
bootstrap();
