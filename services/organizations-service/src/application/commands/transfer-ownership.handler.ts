import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransferOwnershipCommand } from './transfer-ownership.command';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrganizationType } from '../../domain/value-objects/organization-type.vo';

@CommandHandler(TransferOwnershipCommand)
export class TransferOwnershipHandler implements ICommandHandler<TransferOwnershipCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
  ) {}

  async execute(command: TransferOwnershipCommand): Promise<void> {
    const organization = await this.orgRepository.findById(command.organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.type === OrganizationType.PERSONAL) {
      throw new ForbiddenException('Cannot transfer ownership of a personal organization.');
    }

    // Security check: Only the current owner can transfer ownership
    if (organization.ownerId !== command.requesterId) {
      throw new ForbiddenException('Only the organization owner can transfer ownership.');
    }

    // The transferOwnership method in the entity handles the PERSONAL type check
    organization.transferOwnership(command.newOwnerId);

    await this.orgRepository.update(organization);
  }
}
