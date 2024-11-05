import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { AuthLoginDto } from './login.dto';
import { UserDto } from '../user';

export class AuthPayload extends AuthLoginDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: '1',
  })
  @Expose()
  @IsNotEmpty()
  sub!: string;

  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'user123',
  })
  @Expose()
  @IsString()
  username?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjI5MjIwNjI5LCJleHAiOjE2MjkzMDcxMjl9.1'
  })
  @IsJWT()
  @IsNotEmpty()
  accessToken!: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmpty()
  user!: UserDto;
}