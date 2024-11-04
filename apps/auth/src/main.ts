import { bootstrapApp } from '@projectx/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app/app.module';

export * from './app/activities/activities.service';

bootstrapApp(AppModule).catch((err) => {
  Logger.error(
    `⚠️ Application failed to start: ${err}`
  )
  process.exit(1);
});
