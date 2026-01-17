import { DeleteProductUseCase } from './delete-product.usecase';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { Product } from '../../entities/product';

describe('DeleteProductUseCase', () => {
  let productGateway: jest.Mocked<ProductGateway>;

  beforeEach(() => {
    productGateway = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  it('should delete product when it exists', async () => {
    const product = {} as Product;

    productGateway.findById.mockResolvedValue(product);
    productGateway.delete.mockResolvedValue(undefined);

    await DeleteProductUseCase.execute(productGateway, 'product-id');

    expect(productGateway.findById).toHaveBeenCalledWith('product-id');
    expect(productGateway.delete).toHaveBeenCalledWith('product-id');
  });

  it('should throw error when product does not exist', async () => {
    productGateway.findById.mockResolvedValue(null);

    await expect(
      DeleteProductUseCase.execute(productGateway, 'product-id'),
    ).rejects.toThrow('Product not found');

    expect(productGateway.findById).toHaveBeenCalledWith('product-id');
    expect(productGateway.delete).not.toHaveBeenCalled();
  });
});
