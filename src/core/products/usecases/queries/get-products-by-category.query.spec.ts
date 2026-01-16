import { GetProductsByCategoryQuery } from './get-products-by-category.query';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { Product } from '../../entities/product';

describe('GetProductsByCategoryQuery', () => {
  let productGateway: jest.Mocked<ProductGateway>;

  beforeEach(() => {
    productGateway = {
      findByCategory: jest.fn(),
    } as any;
  });

  it('should return products for a given category', async () => {
    const products: Product[] = [{} as Product, {} as Product];

    productGateway.findByCategory.mockResolvedValue(products);

    const result = await GetProductsByCategoryQuery.execute(
      productGateway,
      'category-id',
    );

    expect(productGateway.findByCategory).toHaveBeenCalledWith('category-id');
    expect(result).toBe(products);
  });

  it('should return empty array when no products are found', async () => {
    productGateway.findByCategory.mockResolvedValue([]);

    const result = await GetProductsByCategoryQuery.execute(
      productGateway,
      'category-id',
    );

    expect(productGateway.findByCategory).toHaveBeenCalledWith('category-id');
    expect(result).toEqual([]);
  });
});
