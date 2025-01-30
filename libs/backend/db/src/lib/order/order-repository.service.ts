import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from '@projectx/models';
import { Prisma, OrderStatus } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderRepositoryService {
  private logger = new Logger(OrderRepositoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto
  ) {
    this.logger.verbose(`createOrder(${userId}) - order: ${JSON.stringify(createOrderDto)}`);
    
    return await this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: createOrderDto.items.map((item) => item.productId) },
        },
        select: {
          id: true,
          estimatedPrice: true,
        },
      });
      // Map of productId to price at purchase
      const pricesMap = {} as Record<number, number>;
      // Calculate total price using Prisma.Decimal
      const totalPrice = createOrderDto.items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        pricesMap[item.productId] = product.estimatedPrice.toNumber();
        return acc + product.estimatedPrice.toNumber() * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          userId,
          referenceId: createOrderDto.referenceId,
          totalPrice: new Prisma.Decimal(totalPrice),
          status: OrderStatus.Pending,
          shippingAddress: createOrderDto.shippingAddress,
          items: {
            create: createOrderDto.items.map(item => {
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: pricesMap[item.productId],
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }
}
