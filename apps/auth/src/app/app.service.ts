import { Injectable, Logger } from '@nestjs/common';
import { AuthLoginDto } from '@projectx/models';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);
  
  sendLoginEmail(data: AuthLoginDto) {
    this.logger.log('sendLoginEmail()', data);
  }
}
