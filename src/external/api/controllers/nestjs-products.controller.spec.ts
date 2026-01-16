import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NestJSProductsController } from './nestjs-products.controller';
import { ProductController } from 'src/core/products/operation/controllers/product-controller';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { IdGenerator } from 'src/interfaces/id-generator';
import { ICategoryClient } from 'src/interfaces/category-client.interface';

jest.mock('src/core/products/operation/controllers/product-controller');

describe('NestJSProductsController', () => {
  let controller: NestJSProductsController;
  let productDataSource: jest.Mocked<IProductDataSource>;
  let idGenerator: jest.Mocked<IdGenerator>;
  let categoryClient: jest.Mocked<ICategoryClient>;

  beforeEach(() => {
    productDataSource = {} as any;
    idGenerator = { generate: jest.fn() } as any;
    categoryClient = {} as any;

    controller = new NestJSProductsController(
      productDataSource,
      idGenerator,
      categoryClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products when no categoryId is provided', async () => {
      const result = [{}];
      jest.spyOn(ProductController, 'findAll').mockResolvedValue(result as any);

      const response = await controller.findAll();

      expect(ProductController.findAll).toHaveBeenCalledWith(productDataSource);
      expect(response).toBe(result);
    });

    it('should return products by category when categoryId is provided', async () => {
      const result = [{}];
      jest.spyOn(ProductController, 'findByCategory').mockResolvedValue(result as any);

      const response = await controller.findAll('category-id');

      expect(ProductController.findByCategory).toHaveBeenCalledWith(
        'category-id',
        productDataSource,
      );
      expect(response).toBe(result);
    });

    it('should throw BadRequestException on error', async () => {
      jest
        .spyOn(ProductController, 'findAll')
        .mockRejectedValue(new Error('error'));

      await expect(controller.findAll()).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const product = {};
      jest
        .spyOn(ProductController, 'findById')
        .mockResolvedValue(product as any);

      const response = await controller.findById('id');

      expect(ProductController.findById).toHaveBeenCalledWith(
        'id',
        productDataSource,
        categoryClient,
      );
      expect(response).toBe(product);
    });

    it('should throw NotFoundException when product is null', async () => {
      jest
        .spyOn(ProductController, 'findById')
        .mockResolvedValue(null);

      await expect(controller.findById('id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should rethrow NotFoundException', async () => {
      jest
        .spyOn(ProductController, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findById('id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for generic errors', async () => {
      jest
        .spyOn(ProductController, 'findById')
        .mockRejectedValue(new Error('error'));

      await expect(controller.findById('id')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const dto = {} as any;
      const result = { id: 'id' };

      jest.spyOn(ProductController, 'save').mockResolvedValue(result as any);

      const response = await controller.create(dto);

      expect(ProductController.save).toHaveBeenCalledWith(
        dto,
        productDataSource,
        idGenerator,
      );
      expect(response).toBe(result);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(ProductController, 'save')
        .mockRejectedValue(new Error('Category not found'));

      await expect(controller.create({} as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      jest
        .spyOn(ProductController, 'save')
        .mockRejectedValue(new Error('error'));

      await expect(controller.create({} as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const result = {};
      jest.spyOn(ProductController, 'update').mockResolvedValue(result as any);

      const response = await controller.update('id', {} as any);

      expect(ProductController.update).toHaveBeenCalledWith(
        'id',
        {},
        productDataSource,
      );
      expect(response).toBe(result);
    });

    it('should throw NotFoundException when product not found', async () => {
      jest
        .spyOn(ProductController, 'update')
        .mockRejectedValue(new Error('Product not found'));

      await expect(
        controller.update('id', {} as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw NotFoundException when category not found', async () => {
      jest
        .spyOn(ProductController, 'update')
        .mockRejectedValue(new Error('Category not found'));

      await expect(
        controller.update('id', {} as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw BadRequestException for generic errors', async () => {
      jest
        .spyOn(ProductController, 'update')
        .mockRejectedValue(new Error('error'));

      await expect(
        controller.update('id', {} as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete product successfully', async () => {
      jest.spyOn(ProductController, 'delete').mockResolvedValue(undefined);

      await controller.remove('id');

      expect(ProductController.delete).toHaveBeenCalledWith(
        'id',
        productDataSource,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      jest
        .spyOn(ProductController, 'delete')
        .mockRejectedValue(new Error('Product not found'));

      await expect(controller.remove('id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for generic errors', async () => {
      jest
        .spyOn(ProductController, 'delete')
        .mockRejectedValue(new Error('error'));

      await expect(controller.remove('id')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
