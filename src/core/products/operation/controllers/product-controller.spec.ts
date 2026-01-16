import { ProductController } from './product-controller';
import { ProductUseCase } from '../../usecases/product-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { ProductIdPresenter } from '../presenters/product-id-presenter';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { IdGenerator } from 'src/interfaces/id-generator';
import { ICategoryClient } from 'src/interfaces/category-client.interface';

describe('ProductController', () => {
  const dataSource = {} as IProductDataSource;
  const idGenerator = { generate: jest.fn().mockReturnValue('id') } as IdGenerator;

  const makeProduct = () =>
    new Product(
      'product-id',
      'Product',
      'Description',
      100,
      'category-id',
      new ProductStock(5),
      'image.png',
      new Date(),
      new Date(),
    );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should return all products DTO', async () => {
      const products = [makeProduct()];

      jest.spyOn(ProductUseCase, 'findAll').mockResolvedValue(products);
      jest.spyOn(ProductPresenter, 'toDTO').mockReturnValue([] as any);

      const result = await ProductController.findAll(dataSource);

      expect(ProductUseCase.findAll).toHaveBeenCalled();
      expect(ProductPresenter.toDTO).toHaveBeenCalledWith(products);
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return null when product is not found', async () => {
      jest.spyOn(ProductUseCase, 'findById').mockResolvedValue(null);

      const result = await ProductController.findById('id', dataSource);

      expect(result).toBeNull();
    });

    it('should return product DTO without category when categoryClient is not provided', async () => {
      const product = makeProduct();

      jest.spyOn(ProductUseCase, 'findById').mockResolvedValue(product);
      jest
        .spyOn(ProductPresenter, 'toDTO')
        .mockReturnValue([{ id: 'product-id' }] as any);

      const result = await ProductController.findById('id', dataSource);

      expect(ProductPresenter.toDTO).toHaveBeenCalledWith([product]);
      expect(result).toEqual({ id: 'product-id' });
    });

    it('should return product DTO with category when categoryClient is provided', async () => {
      const product = makeProduct();
      const categoryClient: ICategoryClient = {
        findById: jest.fn().mockResolvedValue({ name: 'Category Name' }),
      } as any;

      jest.spyOn(ProductUseCase, 'findById').mockResolvedValue(product);
      jest
        .spyOn(ProductPresenter, 'toDTOWithCategory')
        .mockReturnValue({ id: 'product-id' } as any);

      const result = await ProductController.findById(
        'id',
        dataSource,
        categoryClient,
      );

      expect(categoryClient.findById).toHaveBeenCalledWith('category-id');
      expect(ProductPresenter.toDTOWithCategory).toHaveBeenCalledWith(
        product,
        'Category Name',
      );
      expect(result).toEqual({ id: 'product-id' });
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const products = [makeProduct()];

      jest.spyOn(ProductUseCase, 'findByCategory').mockResolvedValue(products);
      jest.spyOn(ProductPresenter, 'toDTO').mockReturnValue([] as any);

      const result = await ProductController.findByCategory(
        'category-id',
        dataSource,
      );

      expect(ProductUseCase.findByCategory).toHaveBeenCalled();
      expect(ProductPresenter.toDTO).toHaveBeenCalledWith(products);
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save product and return ProductIdDTO', async () => {
      const product = makeProduct();

      jest.spyOn(ProductUseCase, 'save').mockResolvedValue(product);
      jest
        .spyOn(ProductIdPresenter, 'toDTO')
        .mockReturnValue({ id: 'product-id' });

      const result = await ProductController.save(
        {} as any,
        dataSource,
        idGenerator,
      );

      expect(ProductUseCase.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 'product-id' });
    });
  });

  describe('update', () => {
    it('should update product and return ProductDTO', async () => {
      const product = makeProduct();

      jest.spyOn(ProductUseCase, 'update').mockResolvedValue(product);
      jest
        .spyOn(ProductPresenter, 'toDTO')
        .mockReturnValue([{ id: 'product-id' }] as any);

      const result = await ProductController.update(
        'id',
        {} as any,
        dataSource,
      );

      expect(ProductUseCase.update).toHaveBeenCalled();
      expect(result).toEqual({ id: 'product-id' });
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      jest.spyOn(ProductUseCase, 'delete').mockResolvedValue(undefined);

      await ProductController.delete('id', dataSource);

      expect(ProductUseCase.delete).toHaveBeenCalled();
    });
  });
});
