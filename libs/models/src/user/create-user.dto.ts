import { OmitType, PartialType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class CreateUserDto extends PartialType(
  OmitType(UserDto, ['id', 'createdAt', 'updatedAt', 'deletedAt'] as const)
) {}
