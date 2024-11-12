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
} from 'class-validator';

import { transformToDate } from '../transforms';

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export class OrderDto {
  constructor(partial?: Partial<OrderDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'Unique identifier for the order' })
  @IsDefined()
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Unique identifier for the user who created the order',
  })
  @IsOptional()
  @IsInt()
  @Expose()
  userId!: number;

  @ApiProperty({ description: 'Total price of the order' })
  @IsDefined()
  @IsNumber()
  @Expose()
  totalPrice!: number;

  @ApiProperty({ description: 'Status of the order' })
  @IsDefined()
  @IsEnum(OrderStatus, {
    message: 'Status must be one of the defined enum values.',
  })
  @Expose()
  status!: OrderStatus;

  @ApiProperty({ description: 'Shipping address for the order' })
  @IsDefined()
  @IsString()
  @Expose()
  shippingAddress!: string;

  @ApiProperty({ description: 'Date the order was created' })
  @IsDefined()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  createdAt!: Date;

  @ApiProperty({ description: 'Date the order was last updated' })
  @IsDefined()
  @IsDate()
  @Expose()
  @Transform(({ value }) => transformToDate(value))
  updatedAt!: Date;
}
