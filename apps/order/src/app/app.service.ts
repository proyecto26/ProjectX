import { Injectable } from '@nestjs/common';
import { OrderRepositoryService } from '@projectx/db';

@Injectable()
export class AppService {
  constructor(private readonly OrderService: OrderRepositoryService) {}
  
  async findAll() {
    return this.OrderService.findAll();
  }
}
