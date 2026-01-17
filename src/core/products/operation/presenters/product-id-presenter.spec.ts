import { ProductIdPresenter } from './product-id-presenter';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductIdPresenter', () => {
  it('should convert Product to ProductIdDTO', () => {
    const product = new Product(
      'product-id',
      'Product name',
      'Description',
      100,
      'category-id',
      new ProductStock(5),
      'image.png',
      new Date(),
      new Date(),
    );

    const result = ProductIdPresenter.toDTO(product);

    expect(result).toEqual({ id: 'product-id' });
  });
});
