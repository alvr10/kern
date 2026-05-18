import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectSocialAccountDto } from '../../application/dtos/connect-social-account.dto';
import { ConnectSocialAccountCommand } from '../../application/commands/connect-social-account.command';
import { ListSocialAccountsQuery } from '../../application/queries/list-social-accounts.query';

@Controller('social/accounts')
export class SocialAccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query('organizationId') organizationId: string) {
    return this.queryBus.execute(new ListSocialAccountsQuery(organizationId));
  }

  @Post()
  async connect(@Body() dto: ConnectSocialAccountDto) {
    await this.commandBus.execute(
      new ConnectSocialAccountCommand(
        dto.organizationId,
        dto.platform,
        dto.platformUserId,
        dto.accessToken,
        dto.refreshToken,
        dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      ),
    );
    return { status: 'connected' };
  }
}
