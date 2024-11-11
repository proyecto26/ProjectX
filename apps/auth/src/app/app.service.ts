import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, verifyLoginCodeUpdate } from '@projectx/core';
import { AuthLoginDto, AuthResponseDto, AuthVerifyDto } from '@projectx/models';
import {
  ClientService,
  getWorkflowDescription,
  isWorkflowRunning,
} from '@projectx/workflows';
import { WorkflowExecutionAlreadyStartedError } from '@temporalio/common';
import { plainToInstance } from 'class-transformer';

import { loginUserWorkflow } from '../workflows';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
    private readonly authService: AuthService
  ) {}

  getWorkflowIdByEmail(email: string) {
    return `login-${email}`;
  }

  /**
   * Initiates the login process by sending a verification email.
   * @param body AuthLoginDto containing the user's email.
   * @returns A message indicating the email was sent.
   */
  async login(body: AuthLoginDto) {
    this.logger.log(`sendLoginEmail(${body.email}) - sending email`);
    const taskQueue = this.configService.get<string>('temporal.taskQueue');
    try {
      await this.clientService.client?.workflow.start(loginUserWorkflow, {
        args: [body],
        taskQueue,
        workflowId: this.getWorkflowIdByEmail(body.email),
        searchAttributes: {
          Email: [body.email],
        },
      });
      return { message: 'Login email sent successfully' };
    } catch (error) {
      if (error instanceof WorkflowExecutionAlreadyStartedError) {
        this.logger.log(
          `sendLoginEmail(${body.email}) - workflow already started`
        );
        return { message: 'Login email already sent' };
      } else {
        throw new HttpException(
          `Error starting workflow`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: error,
          }
        );
      }
    }
  }

  /**
   * Verifies the login code and returns an access token.
   * @param body AuthVerifyDto containing the user's email and verification code.
   * @returns AuthResponseDto containing the access token and user information.
   */
  async verifyLoginCode(body: AuthVerifyDto) {
    this.logger.log(`verifyLoginCode(${body.email}) - code: ${body.code}`);
    const workflowId = this.getWorkflowIdByEmail(body.email);

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
      args: [body.code],
    });
    if (!result?.user) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.UNAUTHORIZED
      );
    }

    return plainToInstance(AuthResponseDto, {
      user: result.user,
      accessToken: await this.authService.createAccessToken(result.user),
    });
  }
}
