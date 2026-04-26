import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrganizationCommand } from './create-organization.command';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid or use crypto

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
  ) { }

  async execute(command: CreateOrganizationCommand): Promise<string> {
    const existingOrg = await this.orgRepository.findBySlug(command.slug);
    if (existingOrg) {
      throw new Error('Slug already taken'); // Ideally a domain exception
    }

    const orgId = uuidv4();
    const organization = new Organization(
      orgId,
      command.name,
      command.slug,
      command.logoUrl || null,
      null,
      new Date(),
      new Date(),
    );

    await this.orgRepository.save(organization);
    return orgId;
  }
}
