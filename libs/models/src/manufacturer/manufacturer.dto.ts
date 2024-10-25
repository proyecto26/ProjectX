import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  transformToDate,
  trimTransform,
} from '../transforms';
import { NoProfanity } from '../validators';

export enum ManufacturerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Deleted = 'Suspended',
  Suspended = 'UnderReview',
}

export class ManufacturerDto {
  constructor(partial?: Partial<ManufacturerDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Unique identifier for the manufacturer' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Name of the manufacturer' })
  @IsDefined()
  @IsString()
  @Expose()
  @MaxLength(100)
  @Transform(({ value }) => trimTransform(value))
  @NoProfanity()
  name!: string;

  @ApiProperty({ description: 'Status of the manufacturer' })
  @Expose()
  status!: ManufacturerStatus;

  @ApiProperty()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  updatedAt!: Date;
}
