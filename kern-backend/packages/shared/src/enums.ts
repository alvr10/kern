// Domain enums shared across all KERN microservices

export const CONTENT_STATUS_VALUES = [
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ARCHIVED',
] as const;
export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number];

export const SOCIAL_PLATFORM_VALUES = [
  'TWITTER',
  'LINKEDIN',
  'INSTAGRAM',
  'FACEBOOK',
  'TIKTOK',
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORM_VALUES)[number];

export const AI_ACTION_TYPE_VALUES = [
  'GENERATE',
  'REWRITE',
  'ADAPT',
  'IMPROVE',
] as const;
export type AiActionType = (typeof AI_ACTION_TYPE_VALUES)[number];

export const NOTIFICATION_TYPE_VALUES = [
  'INVITATION',
  'TOKEN_ALERT_80',
  'TOKEN_ALERT_100',
  'CONTENT_APPROVED',
  'CONTENT_REJECTED',
  'PLAN_UPGRADED',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];
