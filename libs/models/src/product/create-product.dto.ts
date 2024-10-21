import { OmitType, PartialType } from '@nestjs/swagger';

import { ProductDto } from './product.dto';

export class CreateProductDto extends PartialType(
  OmitType(ProductDto, ['id', 'createdAt', 'updatedAt'] as const)
) {}
