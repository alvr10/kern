import { IsEnum, IsNotEmpty } from 'class-validator';
import { MemberRole } from '../../domain/value-objects/member-role.vo';

export class UpdateMemberRoleDto {
  @IsEnum(MemberRole)
  @IsNotEmpty()
  role: MemberRole;
}
