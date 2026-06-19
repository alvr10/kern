import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectSocialAccountDto } from '../../application/dtos/connect-social-account.dto';
import { ConnectSocialAccountCommand } from '../../application/commands/connect-social-account.command';
import { DisconnectSocialAccountCommand } from '../../application/commands/disconnect-social-account.command';
import { ListSocialAccountsQuery } from '../../application/queries/list-social-accounts.query';
import { SocialAccountResponseDto } from '../../application/dtos/social-account-response.dto';

@Controller('social/accounts')
export class SocialAccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Query('organizationId') organizationId: string): Promise<SocialAccountResponseDto[]> {
    return this.queryBus.execute(new ListSocialAccountsQuery(organizationId));
  }

  @Post()
  async connect(@Body() dto: ConnectSocialAccountDto): Promise<SocialAccountResponseDto> {
    return this.commandBus.execute(
      new ConnectSocialAccountCommand(
        dto.organizationId,
        dto.platform,
        dto.platformUserId,
        dto.accessToken,
        dto.refreshToken,
        dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async disconnect(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DisconnectSocialAccountCommand(id));
  }
}
