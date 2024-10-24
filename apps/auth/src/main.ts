import { bootstrapApp } from '@projectx/utils';
import { Logger } from '@nestjs/common';

import { AppModule } from './app/app.module';

bootstrapApp(AppModule).catch((err) => {
  Logger.error(
    `⚠️ Application failed to start: ${err}`
  )
  process.exit(1);
});
