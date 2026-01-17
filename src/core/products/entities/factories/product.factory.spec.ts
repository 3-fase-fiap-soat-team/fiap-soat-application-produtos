import { ProductFactory } from './product.factory';
import { IdGenerator } from 'src/interfaces/id-generator';
import { Product } from '../product';
import { ProductStock } from '../value-objects/product-stock';

describe('ProductFactory', () => {
  let factory: ProductFactory;
  let idGenerator: jest.Mocked<IdGenerator>;

  beforeEach(() => {
    idGenerator = {
      generate: jest.fn(),
    };

    factory = new ProductFactory(idGenerator);
  });

  it('should create a product with generated id and valid attributes', () => {
    idGenerator.generate.mockReturnValue('generated-id');

    const product = factory.create(
      'Product name',
      'Product description',
      100,
      'category-id',
      10,
      'image.png',
    );

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBe('generated-id');
    expect(product.name).toBe('Product name');
    expect(product.description).toBe('Product description');
    expect(product.price).toBe(100);
    expect(product.categoryId).toBe('category-id');
    expect(product.stock).toBeInstanceOf(ProductStock);
    expect(product.stock.value).toBe(10);
    expect(product.image).toBe('image.png');
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);

    expect(idGenerator.generate).toHaveBeenCalledTimes(1);
  });

  it('should set createdAt and updatedAt with the same initial value', () => {
    idGenerator.generate.mockReturnValue('generated-id');

    const product = factory.create(
      'Product name',
      'Product description',
      100,
      'category-id',
      5,
      'image.png',
    );

    expect(product.createdAt.getTime()).toBe(product.updatedAt.getTime());
  });

  it('should throw error when stock is invalid', () => {
    idGenerator.generate.mockReturnValue('generated-id');

    expect(() =>
      factory.create(
        'Product name',
        'Product description',
        100,
        'category-id',
        -1,
        'image.png',
      ),
    ).toThrow('O estoque deve ser um número inteiro positivo.');
  });
});
