import { Injectable } from '@nestjs/common';
import { OrderWorkflowData } from '@projectx/core';

import { OrderService } from '../order/order.service';

@Injectable()
export class ActivitiesService {
  constructor(
    public readonly orderService: OrderService
  ) {}

  async createOrder(data: OrderWorkflowData) {
    return await this.orderService.createOrder(data);
  }

  async reportPaymentFailed(orderId: number) {
    return this.orderService.reportPaymentFailed(orderId);
  }
}