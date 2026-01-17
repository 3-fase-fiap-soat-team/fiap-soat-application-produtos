import { UpdateProductUseCase, UpdateProductDTO } from './update-product.usecase';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('UpdateProductUseCase', () => {
  let mockProductGateway: jest.Mocked<ProductGateway>;

  const existingProduct = new Product(
    'product-123',
    'Original Product',
    'Original Description',
    99.99,
    'category-123',
    new ProductStock(10),
    'https://example.com/original.jpg',
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    mockProductGateway = {
      dataSource: {} as any,
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      delete: jest.fn(),
      findManyByIds: jest.fn(),
    } as jest.Mocked<ProductGateway>;
  });

  describe('execute', () => {
    it('deve atualizar produto com sucesso', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 149.99,
        stock: 20,
        image: 'https://example.com/updated.jpg',
      };

      mockProductGateway.findById.mockResolvedValue(existingProduct);
      mockProductGateway.save.mockResolvedValue(existingProduct);

      // Act
      const result = await UpdateProductUseCase.execute(
        mockProductGateway,
        'product-123',
        updateData,
      );

      // Assert
      expect(mockProductGateway.findById).toHaveBeenCalledWith('product-123');
      expect(mockProductGateway.save).toHaveBeenCalledWith(existingProduct);
      expect(result).toBe(existingProduct);
    });

    it('deve lançar erro quando produto não for encontrado', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        name: 'Updated Product',
      };

      mockProductGateway.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        UpdateProductUseCase.execute(
          mockProductGateway,
          'nonexistent-id',
          updateData,
        ),
      ).rejects.toThrow('Product not found');

      expect(mockProductGateway.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(mockProductGateway.save).not.toHaveBeenCalled();
    });
  });
});
