import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrganizationCommand } from './update-organization.command';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationHandler implements ICommandHandler<UpdateOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<void> {
    const organization = await this.orgRepository.findById(command.id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    organization.update(command.name, command.logoUrl, command.brandVoice);
    await this.orgRepository.update(organization);
  }
}
