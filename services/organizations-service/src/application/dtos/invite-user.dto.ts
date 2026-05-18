import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { MemberRole } from '../../domain/value-objects/member-role.vo';

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(MemberRole)
  @IsNotEmpty()
  role: MemberRole;
}
