import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';

import { OrderDto } from './order.dto';

export class OrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsDefined()
  @IsInt()
  @Expose()
  productId!: number;

  @ApiProperty({ description: 'Product quantity' })
  @IsDefined()
  @IsInt()
  @Expose()
  quantity!: number;
}

export class CreateOrderDto extends OmitType(OrderDto, [
  'id',
  'userId',
  'totalPrice',
  'status',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty({
    description: 'Items included in the order',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ description: 'Billing address for the order' })
  @IsDefined()
  @IsString()
  billingAddress!: string;

  @ApiProperty({ description: 'Payment method for the order' })
  @IsDefined()
  @IsString()
  paymentMethod!: string;
}
