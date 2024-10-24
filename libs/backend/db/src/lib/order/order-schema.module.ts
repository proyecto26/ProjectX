import { Module } from '@nestjs/common';

import { OrderRepositoryService } from './order-repository.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [OrderRepositoryService],
  providers: [OrderRepositoryService],
})
export class OrderSchemaModule {}
