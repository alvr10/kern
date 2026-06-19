import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InviteUserCommand } from './invite-user.command';
import { InvitationRepository, INVITATION_REPOSITORY } from '../../domain/repositories/invitation.repository';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Invitation } from '../../domain/entities/invitation.entity';
import { InvitationStatus } from '../../domain/value-objects/invitation-status.vo';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../infrastructure/database/prisma.service';
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
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: InviteUserCommand): Promise<string> {
    const organization = await this.orgRepository.findById(command.organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    if (!organization.canInvite()) {
      throw new Error('Invitations are not allowed for personal organizations.');
    }

    // Check if inviting own self (by comparing inviter's email to command.email)
    const inviterProfile = await this.prisma.profile.findUnique({
      where: { id: command.invitedById },
    });
    if (inviterProfile && inviterProfile.email.toLowerCase() === command.email.toLowerCase()) {
      throw new Error('You cannot invite yourself');
    }

    // Check if invited user is already a member of the organization
    const invitedProfile = await this.prisma.profile.findUnique({
      where: { email: command.email },
    });
    if (invitedProfile) {
      if (invitedProfile.id === command.invitedById) {
        throw new Error('You cannot invite yourself');
      }
      const existingMembership = await this.prisma.membership.findUnique({
        where: {
          profileId_organizationId: {
            profileId: invitedProfile.id,
            organizationId: command.organizationId,
          },
        },
      });
      if (existingMembership) {
        throw new Error('User is already a member of this organization');
      }
    }

    const id = uuidv4();
    const token = uuidv4();
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
      token,
    });

    return id;
  }
}
