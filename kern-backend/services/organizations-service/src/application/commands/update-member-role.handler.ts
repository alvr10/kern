import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMemberRoleCommand } from './update-member-role.command';
import { MembershipRepository, MEMBERSHIP_REPOSITORY } from '../../domain/repositories/membership.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateMemberRoleCommand)
export class UpdateMemberRoleHandler implements ICommandHandler<UpdateMemberRoleCommand> {
  constructor(
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(command: UpdateMemberRoleCommand): Promise<void> {
    const membership = await this.membershipRepository.findById(command.memberId);
    
    if (!membership || membership.organizationId !== command.organizationId) {
      throw new Error('Membership not found in this organization');
    }

    membership.updateRole(command.role);
    await this.membershipRepository.update(membership);
  }
}
