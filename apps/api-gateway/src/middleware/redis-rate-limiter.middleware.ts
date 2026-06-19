import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

export const redisRateLimiter = rateLimit({
  store: new RedisStore({
    // @ts-expect-error - ioredis call is compatible with rate-limit-redis sendCommand
    sendCommand: (...args: string[]) => redis.call(args[0], ...args.slice(1)),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Límite generoso de 1000 peticiones por ventana
  standardHeaders: true, // Retorna cabeceras estándar RateLimit-*
  legacyHeaders: false,
  keyGenerator: req => {
    // Identifica por x-user-id si está autenticado, si no por IP
    return (req.headers['x-user-id'] as string) || req.ip || 'anonymous';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Has excedido la cuota de peticiones permitida. Por favor, inténtalo de nuevo más tarde.',
    });
  },
});
