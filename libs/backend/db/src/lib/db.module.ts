import { Module } from '@nestjs/common';

import { UserSchemaModule } from './user';
import { OrderSchemaModule } from './order';
import { ProductSchemaModule } from './product';

const providers = [UserSchemaModule, OrderSchemaModule, ProductSchemaModule];

@Module({
  imports: providers,
  exports: providers,
})
export class DbModule {}
