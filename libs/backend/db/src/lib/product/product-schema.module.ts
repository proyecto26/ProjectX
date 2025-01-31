import { Module } from '@nestjs/common';

import { ProductRepositoryService } from './product-repository.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [ProductRepositoryService],
  providers: [ProductRepositoryService],
})
export class ProductSchemaModule {} 