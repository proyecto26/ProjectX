import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WorkerService } from './worker.service';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [ActivitiesModule, ConfigModule],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
