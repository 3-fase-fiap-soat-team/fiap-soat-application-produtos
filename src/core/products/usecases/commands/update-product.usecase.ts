import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  image?: string;
}

export class UpdateProductUseCase {
  static async execute(
    productGateway: ProductGateway,
    id: string,
    updateData: UpdateProductDTO,
  ): Promise<Product> {
    const product = await productGateway.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    if (updateData.name !== undefined) {
      product.changeName(updateData.name);
    }
    
    if (updateData.description !== undefined) {
      product.changeDescription(updateData.description);
    }
    
    if (updateData.price !== undefined) {
      product.changePrice(updateData.price);
    }
    
    if (updateData.categoryId !== undefined) {
      product.changeCategoryId(updateData.categoryId);
    }
    
    if (updateData.stock !== undefined) {
      const currentStock = product.stock.value;
      const difference = updateData.stock - currentStock;
      
      if (difference !== 0) {
        const newStock = difference > 0 
          ? product.stock.increase(difference)
          : product.stock.decrease(Math.abs(difference));
        product.changeStock(newStock);
      }
    }
    
    if (updateData.image !== undefined) {
      product.changeImage(updateData.image);
    }

    await productGateway.save(product);
    return product;
  }
}
