import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { transformToLowerCase } from '../transforms';

export class AuthLoginDto {
  @ApiProperty({ description: 'Email address for the user' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  @MaxLength(100)
  @Transform(({ value }) => transformToLowerCase(value))
  @IsString()
  email!: string;
}
