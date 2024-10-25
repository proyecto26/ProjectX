import { Injectable, Logger } from '@nestjs/common';
import { AuthUser } from '@projectx/core';
import { UserRepositoryService } from '@projectx/db';

@Injectable()
export class UserService {
  readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userService: UserRepositoryService
  ) {}

  findOne(user: AuthUser) {
    this.logger.log(`findOne(${user.id})`, user);
    return this.userService.findOneByEmail(user.email);
  }
}
