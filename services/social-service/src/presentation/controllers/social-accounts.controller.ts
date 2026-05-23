import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectSocialAccountDto } from '../../application/dtos/connect-social-account.dto';
import { ConnectSocialAccountCommand } from '../../application/commands/connect-social-account.command';
import { DisconnectSocialAccountCommand } from '../../application/commands/disconnect-social-account.command';
import { ListSocialAccountsQuery } from '../../application/queries/list-social-accounts.query';

@Controller('social/accounts')
export class SocialAccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query('organizationId') organizationId: string) {
    const accounts = await this.queryBus.execute(new ListSocialAccountsQuery(organizationId));
    return accounts.map((acc: any) => ({
      id: acc.id || acc._id?.toString(),
      organizationId: acc.organizationId,
      platform: acc.platform,
      platformUserId: acc.platformUserId,
      profileData: acc.profileData,
      expiresAt: acc.expiresAt,
      createdAt: acc.createdAt,
    }));
  }

  @Post()
  async connect(@Body() dto: ConnectSocialAccountDto) {
    const accountId = await this.commandBus.execute(
      new ConnectSocialAccountCommand(
        dto.organizationId,
        dto.platform,
        dto.platformUserId,
        dto.accessToken,
        dto.refreshToken,
        dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      ),
    );

    const accounts = await this.queryBus.execute(new ListSocialAccountsQuery(dto.organizationId));
    const newAccount = accounts.find((acc: any) => acc.id === accountId || acc._id?.toString() === accountId);

    if (newAccount) {
      return {
        id: newAccount.id || newAccount._id?.toString(),
        organizationId: newAccount.organizationId,
        platform: newAccount.platform,
        platformUserId: newAccount.platformUserId,
        profileData: newAccount.profileData,
        expiresAt: newAccount.expiresAt,
        createdAt: newAccount.createdAt,
      };
    }

    return {
      id: accountId,
      organizationId: dto.organizationId,
      platform: dto.platform,
      platformUserId: dto.platformUserId,
      profileData: {
        handle: `@kern_mock_${dto.platform.toLowerCase()}`,
        name: `KERN Mock ${dto.platform}`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${dto.platform}`,
      },
      expiresAt: dto.expiresAt || null,
      createdAt: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async disconnect(@Param('id') id: string) {
    await this.commandBus.execute(new DisconnectSocialAccountCommand(id));
  }
}
