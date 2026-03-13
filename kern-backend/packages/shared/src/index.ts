// Shared types across all KERN microservices

export interface JwtPayload {
  sub: string;       // Supabase user UUID
  email: string;
  role?: string;     // 'admin' | 'member'
  iat?: number;
  exp?: number;
}

export interface ServiceResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}
