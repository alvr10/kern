import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { InvitationRepository, INVITATION_REPOSITORY } from '../../domain/repositories/invitation.repository';
import { MembershipRepository, MEMBERSHIP_REPOSITORY } from '../../domain/repositories/membership.repository';
import { Membership } from '../../domain/entities/membership.entity';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler implements ICommandHandler<AcceptInvitationCommand> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: InvitationRepository,
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(command: AcceptInvitationCommand): Promise<void> {
    const invitation = await this.invitationRepository.findByToken(command.token);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Call domain logic to accept
    invitation.accept();
    await this.invitationRepository.update(invitation);

    // Create the membership
    const membershipId = uuidv4();
    const membership = new Membership(
      membershipId,
      command.profileId,
      invitation.organizationId,
      invitation.role,
      new Date(),
      new Date(),
    );

    await this.membershipRepository.save(membership);
  }
}
