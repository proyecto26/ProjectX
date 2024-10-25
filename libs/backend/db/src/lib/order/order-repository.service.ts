import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderRepositoryService {
  private logger = new Logger(OrderRepositoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.verbose(`findAll()`);
    return this.prisma.order.findMany();
  }
}
