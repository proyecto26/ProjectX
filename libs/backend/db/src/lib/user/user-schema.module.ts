import { Module } from '@nestjs/common';

import { UserRepositoryService } from './user-repository.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UserRepositoryService],
  providers: [UserRepositoryService],
})
export class UserSchemaModule {}
