import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

import { ActivitiesService } from './activities.service';
import { EmailModule } from '@projectx/email';

@Module({
  imports: [EmailModule, UserModule],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
