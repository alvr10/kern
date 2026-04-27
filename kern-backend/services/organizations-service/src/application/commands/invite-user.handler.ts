import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InviteUserCommand } from './invite-user.command';
import { InvitationRepository, INVITATION_REPOSITORY } from '../../domain/repositories/invitation.repository';
import { Invitation } from '../../domain/entities/invitation.entity';
import { InvitationStatus } from '../../domain/value-objects/invitation-status.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(InviteUserCommand)
export class InviteUserHandler implements ICommandHandler<InviteUserCommand> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: InvitationRepository,
  ) {}

  async execute(command: InviteUserCommand): Promise<string> {
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

    // Here we would dispatch a Domain Event to trigger email sending

    return id;
  }
}
