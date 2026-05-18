import { ContentStatus } from '../value-objects/content-status.vo';
import { SocialPlatform } from '../value-objects/social-platform.vo';
import { Review } from './review.entity';

export class ContentPiece {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly authorId: string,
    public readonly draftId: string | null,
    public title: string,
    public body: string,
    public status: ContentStatus,
    public readonly platform: SocialPlatform,
    public hashtags: string[],
    public mediaUrls: string[],
    public kanbanPosition: number,
    public scheduledAt: Date | null,
    public publishedAt: Date | null,
    public readonly reviews: Review[],
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null = null,
  ) {}

  public update(data: {
    title?: string;
    body?: string;
    hashtags?: string[];
    mediaUrls?: string[];
    scheduledAt?: Date | null;
    kanbanPosition?: number;
  }): void {
    if (data.title) this.title = data.title;
    if (data.body) this.body = data.body;
    if (data.hashtags) this.hashtags = data.hashtags;
    if (data.mediaUrls) this.mediaUrls = data.mediaUrls;
    if (data.scheduledAt !== undefined) this.scheduledAt = data.scheduledAt;
    if (data.kanbanPosition !== undefined) this.kanbanPosition = data.kanbanPosition;
    this.updatedAt = new Date();
  }

  public transitionTo(status: ContentStatus): void {
    this.status = status;
    if (status === ContentStatus.PUBLISHED) {
      this.publishedAt = new Date();
    }
    this.updatedAt = new Date();
  }

  public softDelete(): void {
    this.deletedAt = new Date();
    this.status = ContentStatus.ARCHIVED;
  }
}
