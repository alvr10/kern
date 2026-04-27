import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { OrganizationsController } from './presentation/controllers/organizations.controller';
import { MembersController } from './presentation/controllers/members.controller';
import { InvitationsController } from './presentation/controllers/invitations.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { AdminController } from './presentation/controllers/admin.controller';

// Command Handlers
import { CreateOrganizationHandler } from './application/commands/create-organization.handler';
import { UpdateOrganizationHandler } from './application/commands/update-organization.handler';
import { DeleteOrganizationHandler } from './application/commands/delete-organization.handler';
import { InviteUserHandler } from './application/commands/invite-user.handler';
import { AcceptInvitationHandler } from './application/commands/accept-invitation.handler';
import { UpdateMemberRoleHandler } from './application/commands/update-member-role.handler';
import { RemoveMemberHandler } from './application/commands/remove-member.handler';

// Query Handlers
import { ListOrganizationsHandler } from './application/queries/list-organizations.handler';
import { GetOrganizationHandler } from './application/queries/get-organization.handler';
import { ListMembersHandler } from './application/queries/list-members.handler';

// Repositories
import { ORGANIZATION_REPOSITORY } from './domain/repositories/organization.repository';
import { OrganizationPrismaRepository } from './infrastructure/database/repositories/organization-prisma.repository';
import { MEMBERSHIP_REPOSITORY } from './domain/repositories/membership.repository';
import { MembershipPrismaRepository } from './infrastructure/database/repositories/membership-prisma.repository';
import { INVITATION_REPOSITORY } from './domain/repositories/invitation.repository';
import { InvitationPrismaRepository } from './infrastructure/database/repositories/invitation-prisma.repository';

const CommandHandlers = [
  CreateOrganizationHandler,
  UpdateOrganizationHandler,
  DeleteOrganizationHandler,
  InviteUserHandler,
  AcceptInvitationHandler,
  UpdateMemberRoleHandler,
  RemoveMemberHandler,
];

const QueryHandlers = [
  ListOrganizationsHandler,
  GetOrganizationHandler,
  ListMembersHandler,
];

const Repositories = [
  {
    provide: ORGANIZATION_REPOSITORY,
    useClass: OrganizationPrismaRepository,
  },
  {
    provide: MEMBERSHIP_REPOSITORY,
    useClass: MembershipPrismaRepository,
  },
  {
    provide: INVITATION_REPOSITORY,
    useClass: InvitationPrismaRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [
    OrganizationsController,
    MembersController,
    InvitationsController,
    HealthController,
    AdminController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
  ],
})
export class OrganizationsModule {}
