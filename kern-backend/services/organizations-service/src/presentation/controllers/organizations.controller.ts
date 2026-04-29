import { Body, Controller, Delete, Get, Param, Patch, Post, Headers } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrganizationDto } from '../../application/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '../../application/dtos/update-organization.dto';
import { CreateOrganizationCommand } from '../../application/commands/create-organization.command';
import { UpdateOrganizationCommand } from '../../application/commands/update-organization.command';
import { DeleteOrganizationCommand } from '../../application/commands/delete-organization.command';
import { GetOrganizationQuery } from '../../application/queries/get-organization.query';
import { ListOrganizationsQuery } from '../../application/queries/list-organizations.query';
import { TransferOwnershipDto } from '../../application/dtos/transfer-ownership.dto';
import { TransferOwnershipCommand } from '../../application/commands/transfer-ownership.command';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async list(@Headers() headers: Record<string, string>) {
    const profileId = headers['x-user-id'];
    return this.queryBus.execute(new ListOrganizationsQuery(profileId));
  }

  @Post()
  async create(@Headers() headers: Record<string, string>, @Body() dto: CreateOrganizationDto) {
    const profileId = headers['x-user-id'];
    const orgId = await this.commandBus.execute(
      new CreateOrganizationCommand(dto.name, dto.slug, profileId, dto.logoUrl),
    );
    return this.queryBus.execute(new GetOrganizationQuery(orgId));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrganizationQuery(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    await this.commandBus.execute(new UpdateOrganizationCommand(id, dto.name, dto.logoUrl, dto.brandVoice));
    return this.queryBus.execute(new GetOrganizationQuery(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteOrganizationCommand(id));
  }

  @Patch(':id/owner')
  async transferOwnership(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
    @Body() dto: TransferOwnershipDto,
  ) {
    const requesterId = headers['x-user-id'];
    await this.commandBus.execute(new TransferOwnershipCommand(id, requesterId, dto.newOwnerId));
    return this.queryBus.execute(new GetOrganizationQuery(id));
  }
}
