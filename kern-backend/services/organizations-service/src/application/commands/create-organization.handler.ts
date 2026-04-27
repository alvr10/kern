import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrganizationCommand } from './create-organization.command';
import { OrganizationRepository, ORGANIZATION_REPOSITORY } from '../../domain/repositories/organization.repository';
import { MembershipRepository, MEMBERSHIP_REPOSITORY } from '../../domain/repositories/membership.repository';
import { Organization } from '../../domain/entities/organization.entity';
import { Membership } from '../../domain/entities/membership.entity';
import { MemberRole } from '../../domain/value-objects/member-role.vo';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: OrganizationRepository,
    @Inject(MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<string> {
    const existingOrg = await this.orgRepository.findBySlug(command.slug);
    if (existingOrg) {
      throw new Error('Slug already taken');
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

    // Create initial membership for the creator
    const membershipId = uuidv4();
    const membership = new Membership(
      membershipId,
      command.creatorId,
      orgId,
      MemberRole.ADMIN,
      new Date(),
      new Date(),
    );

    await this.membershipRepository.save(membership);

    return orgId;
  }
}
