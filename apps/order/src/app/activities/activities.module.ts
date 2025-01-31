import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ActivitiesService } from './activities.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [HttpModule, OrderModule],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
