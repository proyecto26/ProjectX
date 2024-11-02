import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from '@projectx/models';
import { ClientService } from '@projectx/workflows';

import { loginUserWorkflow } from '../workflows';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
  ) {}
  
  async sendLoginEmail(data: AuthLoginDto) {
    this.logger.log('sendLoginEmail()', data);
    const taskQueue = this.configService.get<string>('temporal.taskQueue');

    await this.clientService.client?.workflow.start(loginUserWorkflow, {
      args: [data],
      taskQueue,
      workflowId: `login-${data.email}`,
      searchAttributes: {
        Email: [data.email],
      },
    });
  }
}
