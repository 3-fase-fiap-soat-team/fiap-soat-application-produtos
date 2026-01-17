import { ProductGateway } from './product-gateway';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductGateway', () => {
  let gateway: ProductGateway;
  let dataSource: jest.Mocked<IProductDataSource>;

  const product = new Product(
    'product-id',
    'Product name',
    'Product description',
    100,
    'category-id',
    new ProductStock(10),
    'image.png',
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    dataSource = {
        save: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        delete: jest.fn(),
        findByCategory: jest.fn(),
        findManyByIds: jest.fn(),
        update: jest.fn()
    } as jest.Mocked<IProductDataSource>;

    gateway = new ProductGateway(dataSource);
  });

  it('should save a product', async () => {
    dataSource.save.mockResolvedValue(product);

    const result = await gateway.save(product);

    expect(dataSource.save).toHaveBeenCalledWith(product);
    expect(result).toBe(product);
  });

  it('should return all products', async () => {
    dataSource.findAll.mockResolvedValue([product]);

    const result = await gateway.findAll();

    expect(dataSource.findAll).toHaveBeenCalled();
    expect(result).toEqual([product]);
  });

  it('should return product by id', async () => {
    dataSource.findById.mockResolvedValue(product);

    const result = await gateway.findById('product-id');

    expect(dataSource.findById).toHaveBeenCalledWith('product-id');
    expect(result).toBe(product);
  });

  it('should return null when product is not found', async () => {
    dataSource.findById.mockResolvedValue(null);

    const result = await gateway.findById('invalid-id');

    expect(dataSource.findById).toHaveBeenCalledWith('invalid-id');
    expect(result).toBeNull();
  });

  it('should delete a product by id', async () => {
    dataSource.delete.mockResolvedValue(undefined);

    await gateway.delete('product-id');

    expect(dataSource.delete).toHaveBeenCalledWith('product-id');
  });

  it('should return products by category', async () => {
    dataSource.findByCategory.mockResolvedValue([product]);

    const result = await gateway.findByCategory('category-id');

    expect(dataSource.findByCategory).toHaveBeenCalledWith('category-id');
    expect(result).toEqual([product]);
  });

  it('should return products by ids', async () => {
    dataSource.findManyByIds.mockResolvedValue([product]);

    const result = await gateway.findManyByIds(['product-id']);

    expect(dataSource.findManyByIds).toHaveBeenCalledWith(['product-id']);
    expect(result).toEqual([product]);
  });
});
