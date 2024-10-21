import { OmitType, PartialType } from '@nestjs/swagger';

import { RoleDto } from './role.dto';

export class CreateRoleDto extends PartialType(
  OmitType(RoleDto, ['id', 'createdAt', 'updatedAt'] as const)
) {}
