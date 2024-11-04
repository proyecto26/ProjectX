import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verifyLoginCodeUpdate } from '@projectx/core';
import { AuthLoginDto, AuthVerifyDto } from '@projectx/models';
import {
  ClientService,
  getWorkflowDescription,
  isWorkflowRunning,
} from '@projectx/workflows';

import { loginUserWorkflow } from '../workflows';
import { WorkflowExecutionAlreadyStartedError } from '@temporalio/common';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService
  ) {}

  getWorkflowIdByEmail(email: string) {
    return `login-${email}`;
  }

  async sendLoginEmail(data: AuthLoginDto) {
    this.logger.log(`sendLoginEmail(${data.email}) - sending email`);
    const taskQueue = this.configService.get<string>('temporal.taskQueue');
    try {
      await this.clientService.client?.workflow.start(loginUserWorkflow, {
        args: [data],
        taskQueue,
        workflowId: this.getWorkflowIdByEmail(data.email),
        searchAttributes: {
          Email: [data.email],
        },
      });
    } catch (error) {
      if (error instanceof WorkflowExecutionAlreadyStartedError) {
        this.logger.log(
          `sendLoginEmail(${data.email}) - workflow already started`
        );
      } else {
        throw new HttpException(
          `Error starting workflow`,
          HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error,
          }
        );
      }
    }
  }

  async verifyLoginCode(data: AuthVerifyDto) {
    this.logger.log(`verifyLoginCode(${data.email}) - code: ${data.code}`);
    const workflowId = this.getWorkflowIdByEmail(data.email);

    const description = await getWorkflowDescription(
      this.clientService.client?.workflow,
      workflowId
    );
    const isLoginRunning = isWorkflowRunning(description);

    if (!isLoginRunning) {
      throw new HttpException('The code has expired', HttpStatus.BAD_REQUEST);
    }

    const handle = this.clientService.client?.workflow.getHandle(workflowId);
    const result = await handle.executeUpdate(verifyLoginCodeUpdate, {
      args: [data.code],
    });
    if (!result?.user) {
      throw new UnauthorizedException();
    }

    return {
      user: result.user,
      accessToken: await this.jwtService.signAsync({
        sub: result.user.id,
        email: data.email,
        username: result.user.username,
      }),
    };
  }
}
