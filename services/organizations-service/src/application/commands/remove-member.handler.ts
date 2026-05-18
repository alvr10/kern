import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMemberCommand } from './remove-member.command';
import { MembershipRepository, MEMBERSHIP_REPOSITORY } from '../../domain/repositories/membership.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const membership = await this.membershipRepository.findById(command.memberId);

    if (!membership || membership.organizationId !== command.organizationId) {
      throw new Error('Membership not found in this organization');
    }

    await this.membershipRepository.delete(command.memberId);
  }
}
