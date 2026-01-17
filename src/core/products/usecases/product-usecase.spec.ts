import { ProductUseCase } from './product-usecase';
import { ProductGateway } from '../operation/gateways/product-gateway';
import { ProductFactory } from '../entities/factories/product.factory';
import { Product } from '../entities/product';
import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { UpdateProductDTO } from './commands/update-product.usecase';

// Commands
import { CreateProductUseCase } from './commands/create-product.usecase';
import { UpdateProductUseCase } from './commands/update-product.usecase';
import { DeleteProductUseCase } from './commands/delete-product.usecase';

// Queries
import { GetAllProductsQuery } from './queries/get-all-products.query';
import { GetProductByIdQuery } from './queries/get-product-by-id.query';
import { GetProductsByCategoryQuery } from './queries/get-products-by-category.query';

describe('ProductUseCase Facade', () => {
  const productGateway = {} as ProductGateway;
  const factory = {} as ProductFactory;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should delegate to GetAllProductsQuery', async () => {
      const products = [jest.fn() as unknown as Product];

      jest
        .spyOn(GetAllProductsQuery, 'execute')
        .mockResolvedValue(products);

      const result = await ProductUseCase.findAll(productGateway);

      expect(GetAllProductsQuery.execute).toHaveBeenCalledWith(productGateway);
      expect(result).toBe(products);
    });
  });

  describe('findById', () => {
    it('should delegate to GetProductByIdQuery', async () => {
      const product = jest.fn() as unknown as Product;

      jest
        .spyOn(GetProductByIdQuery, 'execute')
        .mockResolvedValue(product);

      const result = await ProductUseCase.findById(productGateway, 'id');

      expect(GetProductByIdQuery.execute).toHaveBeenCalledWith(
        productGateway,
        'id',
      );
      expect(result).toBe(product);
    });
  });

  describe('findByCategory', () => {
    it('should delegate to GetProductsByCategoryQuery', async () => {
      const products: Product[] = [];

      jest
        .spyOn(GetProductsByCategoryQuery, 'execute')
        .mockResolvedValue(products);

      const result = await ProductUseCase.findByCategory(
        productGateway,
        'category-id',
      );

      expect(GetProductsByCategoryQuery.execute).toHaveBeenCalledWith(
        productGateway,
        'category-id',
      );
      expect(result).toBe(products);
    });
  });

  describe('save', () => {
    it('should delegate to CreateProductUseCase', async () => {
      const dto = {} as NewProductDTO;
      const product = jest.fn() as unknown as Product;

      jest
        .spyOn(CreateProductUseCase, 'execute')
        .mockResolvedValue(product);

      const result = await ProductUseCase.save(
        dto,
        productGateway,
        factory,
      );

      expect(CreateProductUseCase.execute).toHaveBeenCalledWith(
        dto,
        productGateway,
        factory,
      );
      expect(result).toBe(product);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateProductUseCase', async () => {
      const updateData = {} as UpdateProductDTO;
      const product = jest.fn() as unknown as Product;

      jest
        .spyOn(UpdateProductUseCase, 'execute')
        .mockResolvedValue(product);

      const result = await ProductUseCase.update(
        productGateway,
        'id',
        updateData,
      );

      expect(UpdateProductUseCase.execute).toHaveBeenCalledWith(
        productGateway,
        'id',
        updateData,
      );
      expect(result).toBe(product);
    });
  });

  describe('delete', () => {
    it('should delegate to DeleteProductUseCase', async () => {
      jest
        .spyOn(DeleteProductUseCase, 'execute')
        .mockResolvedValue(undefined);

      await ProductUseCase.delete(productGateway, 'id');

      expect(DeleteProductUseCase.execute).toHaveBeenCalledWith(
        productGateway,
        'id',
      );
    });
  });
});
