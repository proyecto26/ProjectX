import { Injectable, Logger } from '@nestjs/common';
import { ProductDto, ProductStatus } from '@projectx/models';

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  /**
   * Retrieves all available products.
   * @returns Array of ProductDto containing the product information.
   */
  getProducts(): ProductDto[] {
    this.logger.log('getProducts() - retrieving all products');
    // TODO: Replace with actual database query
    return [
      new ProductDto({
        id: 1,
        name: 'Sample Product 1',
        description: 'This is a sample product',
        estimatedPrice: 99.99,
        status: ProductStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new ProductDto({
        id: 2,
        name: 'Sample Product 2',
        description: 'This is another sample product',
        estimatedPrice: 149.99,
        status: ProductStatus.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  }
}
