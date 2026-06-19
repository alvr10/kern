import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { redis } from '../lib/redis';

// Public routes that bypass JWT verification
const PUBLIC_ROUTES: Array<{ method: string; prefix: string }> = [
  { method: 'GET', prefix: '/health' },
  { method: 'GET', prefix: '/api/docs' },
  { method: 'GET', prefix: '/api/v1/billing/plans' }, // Public plan list
  { method: 'POST', prefix: '/api/v1/billing/webhooks' }, // Stripe webhooks use their own sig
];

function isPublicRoute(method: string, path: string): boolean {
  return PUBLIC_ROUTES.some(r => r.method === method && path.startsWith(r.prefix));
}

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    supabase = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabase;
}

export async function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const isPublic = isPublicRoute(req.method, req.path);
  console.log(`[jwtAuth] ${req.method} ${req.path} - Public: ${isPublic}`);

  if (isPublic) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const cacheKey = `supabase:session:${tokenHash}`;

  try {
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      req.headers['x-user-id'] = user.id;
      req.headers['x-user-email'] = user.email;
      next();
      return;
    }
  } catch (err) {
    console.error('[jwtAuth] Redis cache read failed:', err);
  }

  const { data, error } = await getSupabaseClient().auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const userData = {
    id: data.user.id,
    email: data.user.email ?? '',
  };

  try {
    // Cache the session in Redis with a 5-minute TTL (300 seconds)
    await redis.set(cacheKey, JSON.stringify(userData), 'EX', 300);
  } catch (err) {
    console.error('[jwtAuth] Redis cache write failed:', err);
  }

  // Inject verified identity as headers for downstream services to consume
  req.headers['x-user-id'] = userData.id;
  req.headers['x-user-email'] = userData.email;

  next();
}
