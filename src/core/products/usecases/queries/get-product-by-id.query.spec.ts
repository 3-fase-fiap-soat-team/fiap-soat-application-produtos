import { GetProductByIdQuery } from './get-product-by-id.query';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { Product } from '../../entities/product';

describe('GetProductByIdQuery', () => {
  let productGateway: jest.Mocked<ProductGateway>;

  beforeEach(() => {
    productGateway = {
      findById: jest.fn(),
    } as any;
  });

  it('should return product when found', async () => {
    const product = {} as Product;

    productGateway.findById.mockResolvedValue(product);

    const result = await GetProductByIdQuery.execute(productGateway, 'product-id');

    expect(productGateway.findById).toHaveBeenCalledWith('product-id');
    expect(result).toBe(product);
  });

  it('should return null when product is not found', async () => {
    productGateway.findById.mockResolvedValue(null);

    const result = await GetProductByIdQuery.execute(productGateway, 'product-id');

    expect(productGateway.findById).toHaveBeenCalledWith('product-id');
    expect(result).toBeNull();
  });
});
