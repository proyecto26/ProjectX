import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Product, ProductStatus } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from '@projectx/models';

@Injectable()
export class ProductRepositoryService {
  private logger = new Logger(ProductRepositoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    userId: number,
    data: Omit<Prisma.ProductCreateInput, 'user'>
  ): Promise<Product> {
    this.logger.verbose(`createProduct(${userId}) - product: ${JSON.stringify(data)}`);
    
    return this.prisma.product.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateProduct(
    productId: number,
    data: Partial<Omit<Prisma.ProductUpdateInput, 'user'>>
  ): Promise<Product> {
    this.logger.verbose(`updateProduct(${productId}) - data: ${JSON.stringify(data)}`);
    
    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async findProductById(productId: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async findProductBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async findProducts(
    ...data: Parameters<PrismaService['product']['findMany']>
  ): Promise<ProductDto[]> {
    const products = await this.prisma.product.findMany(...data);
    return plainToInstance(ProductDto, products, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  async deleteProduct(productId: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async updateProductStatus(
    productId: number,
    status: ProductStatus
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id: productId },
      data: { status },
    });
  }
} 