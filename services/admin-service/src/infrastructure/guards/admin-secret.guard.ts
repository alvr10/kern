import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    const headerSecret = request.headers['x-admin-secret'];

    if (!adminSecret || headerSecret !== adminSecret) {
      throw new UnauthorizedException('Invalid or missing admin secret');
    }

    return true;
  }
}
