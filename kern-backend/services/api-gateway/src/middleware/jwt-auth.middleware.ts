import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';

// Public routes that bypass JWT verification
const PUBLIC_ROUTES: Array<{ method: string; prefix: string }> = [
  { method: 'GET',  prefix: '/health' },
  { method: 'GET',  prefix: '/api/docs' },
  { method: 'GET',  prefix: '/billing/plans' },    // Public plan list
  { method: 'POST', prefix: '/billing/webhooks' }, // Stripe webhooks use their own sig
];

function isPublicRoute(method: string, path: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => r.method === method && path.startsWith(r.prefix),
  );
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

export async function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (isPublicRoute(req.method, req.path)) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  const { data, error } = await getSupabaseClient().auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // Inject verified identity as headers for downstream services to consume
  req.headers['x-user-id']    = data.user.id;
  req.headers['x-user-email'] = data.user.email ?? '';

  next();
}
