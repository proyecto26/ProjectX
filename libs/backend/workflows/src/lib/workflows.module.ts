import { Module } from '@nestjs/common';
import { ClientService } from './client';

@Module({
  controllers: [],
  providers: [ClientService],
  exports: [ClientService],
})
export class WorkflowsModule {}
