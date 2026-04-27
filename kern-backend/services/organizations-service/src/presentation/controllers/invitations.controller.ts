import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InviteUserDto } from '../../application/dtos/invite-user.dto';
import { InviteUserCommand } from '../../application/commands/invite-user.command';
import { AcceptInvitationCommand } from '../../application/commands/accept-invitation.command';

@Controller()
export class InvitationsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('organizations/:id/invitations')
  async inviteUser(@Param('id') organizationId: string, @Body() dto: InviteUserDto) {
    const invitedById = 'dummy-inviter-id'; // Auth context
    const invitationId = await this.commandBus.execute(
      new InviteUserCommand(organizationId, invitedById, dto.email, dto.role),
    );
    return { invitationId };
  }

  @Post('invitations/:token/accept')
  async acceptInvitation(@Param('token') token: string) {
    const profileId = 'dummy-profile-id'; // Auth context
    await this.commandBus.execute(new AcceptInvitationCommand(token, profileId));
    return { success: true };
  }
}
