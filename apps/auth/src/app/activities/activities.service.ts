import { Injectable, Logger } from '@nestjs/common';
import { compareValue, hashValue } from '@projectx/core';
import { EmailService } from '@projectx/email';
import { UserDto } from '@projectx/models';

import { UserService } from '../user/user.service';

function generateRandomSixDigitNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

@Injectable()
export class ActivitiesService {
  readonly logger = new Logger(ActivitiesService.name);
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {}

  async getHelloMessage() {
    return 'Hello World';
  }

  async sendLoginEmail(email: string) {
    const code = generateRandomSixDigitNumber();
    this.logger.log(`sendLoginEmail(${email}) - code generated: ${code}`);
    const hashedCode = await hashValue(code.toString());
    await this.emailService.sendLoginEmail(
      {
        token: hashedCode,
        userName: email.split('@')[0],
      },
      email
    );

    return hashedCode;
  }

  async verifyLoginCode(email: string, code: number, hashedCode: string) {
    let user: UserDto | undefined = undefined;
    const isValid = await compareValue(code.toString(), hashedCode);
    if (isValid) {
      user = await this.userService.getOrCreate(email);
    }
    return user;
  }
}
