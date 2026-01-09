import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { ProductFactory } from '../../entities/factories/product.factory';

export class CreateProductUseCase {
  static async execute(
    product: NewProductDTO,
    productGateway: ProductGateway,
    factory: ProductFactory,
  ): Promise<Product> {
    const newProduct = factory.create(
      product.name,
      product.description,
      product.price,
      product.categoryId,
      product.stock,
      product.image,
    );

    return await productGateway.save(newProduct);
  }
}
