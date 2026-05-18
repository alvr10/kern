import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrganizationCommand } from './delete-organization.command';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationHandler implements ICommandHandler<DeleteOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<void> {
    const organization = await this.orgRepository.findById(command.id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    organization.softDelete();
    await this.orgRepository.update(organization);
  }
}
