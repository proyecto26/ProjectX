import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@projectx/db';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserRepositoryService) {}
  
  findAll() {
    return this.userService.findAll();
  }
}
