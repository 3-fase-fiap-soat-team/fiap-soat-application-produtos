import { CreateProductUseCase } from './create-product.usecase';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { ProductFactory } from '../../entities/factories/product.factory';
import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('CreateProductUseCase', () => {
  let mockProductGateway: jest.Mocked<ProductGateway>;
  let mockProductFactory: jest.Mocked<ProductFactory>;

  const mockProduct = new Product(
    'product-123',
    'Test Product',
    'Test Description',
    99.99,
    'category-123',
    new ProductStock(10),
    'https://example.com/image.jpg',
    new Date(),
    new Date(),
  );

  const newProductDTO: NewProductDTO = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    categoryId: 'category-123',
    stock: 10,
    image: 'https://example.com/image.jpg',
  };

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

    mockProductFactory = {
      create: jest.fn(),
      idGenerator: { generate: jest.fn().mockReturnValue('product-123') } as any,
    } as unknown as jest.Mocked<ProductFactory>;
  });

  describe('execute', () => {
    it('deve criar produto com sucesso', async () => {
      // Arrange
      mockProductFactory.create.mockReturnValue(mockProduct);
      mockProductGateway.save.mockResolvedValue(mockProduct);

      // Act
      const result = await CreateProductUseCase.execute(
        newProductDTO,
        mockProductGateway,
        mockProductFactory,
      );

      // Assert
      expect(mockProductFactory.create).toHaveBeenCalledWith(
        newProductDTO.name,
        newProductDTO.description,
        newProductDTO.price,
        newProductDTO.categoryId,
        newProductDTO.stock,
        newProductDTO.image,
      );
      expect(mockProductGateway.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toBe(mockProduct);
    });
  });
});
