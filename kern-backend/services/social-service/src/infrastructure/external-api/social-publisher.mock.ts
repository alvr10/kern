import { Injectable } from '@nestjs/common';
import { SocialPlatform } from '../../domain/value-objects/social-platform.vo';
import { v4 as uuidv4 } from 'uuid';

export interface PublishResult {
  platformPostId: string;
  url: string;
  publishedAt: Date;
}

@Injectable()
export class SocialPublisherMock {
  async publish(
    platform: SocialPlatform,
    content: { title: string; body: string; mediaUrls?: string[] },
    accessToken: string,
  ): Promise<PublishResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const platformPostId = `mock_${platform.toLowerCase()}_${uuidv4().split('-')[0]}`;
    let url = '';

    switch (platform) {
      case SocialPlatform.TWITTER:
        url = `https://twitter.com/kern_mock/status/${platformPostId}`;
        break;
      case SocialPlatform.LINKEDIN:
        url = `https://www.linkedin.com/feed/update/${platformPostId}`;
        break;
      case SocialPlatform.INSTAGRAM:
        url = `https://www.instagram.com/p/${platformPostId}`;
        break;
      case SocialPlatform.FACEBOOK:
        url = `https://www.facebook.com/kern_mock/posts/${platformPostId}`;
        break;
      case SocialPlatform.TIKTOK:
        url = `https://www.tiktok.com/@kern_mock/video/${platformPostId}`;
        break;
    }

    return {
      platformPostId,
      url,
      publishedAt: new Date(),
    };
  }

  async getProfile(platform: SocialPlatform, accessToken: string): Promise<any> {
    return {
      handle: `@kern_mock_${platform.toLowerCase()}`,
      name: `KERN Mock ${platform}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${platform}`,
    };
  }
}
