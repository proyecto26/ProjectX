import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { transformToDate, trimTransform } from '../transforms';
import { NoProfanity } from '../validators';

export enum ProductStatus {
  Active = 'Available',
  Inactive = 'Unavailable',
  Deleted = 'Discontinued',
}

export class ProductDto {
  constructor(partial?: Partial<ProductDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Unique identifier for the product' })
  @IsDefined()
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Unique identifier for the user who designed the product',
  })
  @IsOptional()
  @IsInt()
  @Expose()
  createdBy?: number;

  @ApiProperty({ description: 'Name of the product' })
  @IsDefined()
  @IsString()
  @Expose()
  @MaxLength(100)
  @Transform(({ value }) => trimTransform(value))
  @NoProfanity()
  name!: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsDefined()
  @IsString()
  @Expose()
  @MaxLength(200)
  @Transform(({ value }) => trimTransform(value))
  @NoProfanity()
  description?: string;

  @ApiProperty({ description: 'Estimated price of the product' })
  @IsDefined()
  @IsNumber()
  @Expose()
  estimatedPrice!: number;

  @ApiProperty({ description: 'Status of the product' })
  @IsEnum(ProductStatus, {
    message: 'Status must be one of the defined enum values.',
  })
  @Expose()
  status?: ProductStatus;

  @ApiProperty({ description: 'Date the product was created' })
  @IsDefined()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  createdAt!: Date;

  @ApiProperty({ description: 'Date the product was last updated' })
  @IsDefined()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  updatedAt!: Date;
}
