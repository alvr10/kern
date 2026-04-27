import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateMemberRoleDto } from '../../application/dtos/update-member-role.dto';
import { UpdateMemberRoleCommand } from '../../application/commands/update-member-role.command';
import { RemoveMemberCommand } from '../../application/commands/remove-member.command';
import { ListMembersQuery } from '../../application/queries/list-members.query';

@Controller('organizations/:id/members')
export class MembersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Param('id') organizationId: string) {
    return this.queryBus.execute(new ListMembersQuery(organizationId));
  }

  @Patch(':memberId')
  async updateRole(
    @Param('id') organizationId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    await this.commandBus.execute(new UpdateMemberRoleCommand(organizationId, memberId, dto.role));
    // return the updated list or member
    return { success: true };
  }

  @Delete(':memberId')
  async remove(@Param('id') organizationId: string, @Param('memberId') memberId: string) {
    await this.commandBus.execute(new RemoveMemberCommand(organizationId, memberId));
  }
}
