import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../application/commands/create-notification.command';
import { NotificationType } from '../../domain/entities/notification.entity';

@Controller()
export class OrganizationEventConsumer {
  private readonly logger = new Logger(OrganizationEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('organization.invitation.created')
  async handleInvitationCreated(@Payload() data: any): Promise<void> {
    this.logger.log(`Received organization invitation event: ${JSON.stringify(data)}`);

    // The event from organization-service contains email, organizationName, etc.
    const { email, userId, organizationId, organizationName, inviterName, inviterId, role, token } = data;
    const targetUserId = userId || email;

    if (!targetUserId) {
      this.logger.warn('Received invitation event without userId or email');
      return;
    }

    const sender = inviterName || 'Someone';
    const roleName = role || 'MEMBER';

    await this.commandBus.execute(
      new CreateNotificationCommand(
        targetUserId,
        NotificationType.INVITATION,
        'New Organization Invitation',
        `You have been invited to join ${organizationName} as ${roleName} by ${sender}.`,
        { organizationName, inviterName: sender, inviterId, role: roleName, token, organizationId },
      ),
    );
  }
}
