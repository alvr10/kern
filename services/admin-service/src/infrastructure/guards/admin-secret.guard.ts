import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Option 1: x-user-role header injected by the API gateway
    const userRole = request.headers['x-user-role'];
    if (userRole === 'admin') return true;

    // Option 2: Decode the JWT payload directly — the gateway already verified
    // the signature so we just read the claims without re-verifying.
    const authHeader = request.headers['authorization'] as string | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const payloadB64 = token.split('.')[1];
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
        if (payload?.app_metadata?.role === 'admin') return true;
      } catch {
        // malformed JWT — fall through
      }
    }

    // Option 3: shared secret for internal tooling / CLI
    const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    const headerSecret = request.headers['x-admin-secret'] as string | undefined;
    if (adminSecret && headerSecret === adminSecret) return true;

    throw new UnauthorizedException('Access denied: Admins only');
  }
}
