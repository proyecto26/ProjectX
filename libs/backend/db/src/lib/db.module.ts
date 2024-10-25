import { Module } from '@nestjs/common';

import { UserSchemaModule } from './user';
import { OrderSchemaModule } from './order';
@Module({
  imports: [UserSchemaModule, OrderSchemaModule],
  exports: [UserSchemaModule, OrderSchemaModule],
})
export class DbModule {}
