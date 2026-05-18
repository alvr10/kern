import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InviteUserCommand } from './invite-user.command';
import { InvitationRepository, INVITATION_REPOSITORY } from '../../domain/repositories/invitation.repository';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Invitation } from '../../domain/entities/invitation.entity';
import { InvitationStatus } from '../../domain/value-objects/invitation-status.vo';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(InviteUserCommand)
export class InviteUserHandler implements ICommandHandler<InviteUserCommand> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: InvitationRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  async execute(command: InviteUserCommand): Promise<string> {
    const organization = await this.orgRepository.findById(command.organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    if (!organization.canInvite()) {
      throw new Error('Invitations are not allowed for personal organizations.');
    }

    const id = uuidv4();
    const token = uuidv4(); // in reality, maybe a secure random string
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const invitation = new Invitation(
      id,
      command.organizationId,
      command.invitedById,
      command.email,
      command.role,
      token,
      InvitationStatus.PENDING,
      expiresAt,
      null,
      new Date(),
    );

    await this.invitationRepository.save(invitation);

    // Notify the user (notification service will handle the in-app notification)
    this.notificationsClient.emit('organization.invitation.created', {
      email: command.email,
      organizationId: command.organizationId,
      organizationName: organization.name,
      inviterId: command.invitedById,
      role: command.role,
    });

    return id;
  }
}
