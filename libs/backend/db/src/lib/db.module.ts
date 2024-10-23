import { Module } from '@nestjs/common';

import { UserSchemaModule } from './user';

@Module({
  imports: [UserSchemaModule],
  exports: [UserSchemaModule],
})
export class DbModule {}
