import { ProductPresenter } from './product-presenter';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductPresenter', () => {
  const makeProduct = (overrides?: Partial<Product>): Product => {
    return new Product(
      overrides?.id ?? 'product-id',
      overrides?.name ?? 'Product name',
      overrides?.description ?? 'Description',
      overrides?.price ?? 100,
      overrides?.categoryId ?? 'category-id',
      overrides?.stock ?? new ProductStock(10),
      overrides?.image ?? 'image.png',
      new Date(),
      new Date(),
    );
  };

  describe('toDTO', () => {
    it('should convert products to ProductDTO list', () => {
      const products = [makeProduct(), makeProduct({ id: 'p2' })];

      const result = ProductPresenter.toDTO(products);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'product-id',
        name: 'Product name',
        description: 'Description',
        price: 100,
        stock: 10,
        image: 'image.png',
      });
    });

    it('should return empty array when products is null', () => {
      const result = ProductPresenter.toDTO(null as any);

      expect(result).toEqual([]);
    });

    it('should return empty array when products is undefined', () => {
      const result = ProductPresenter.toDTO(undefined as any);

      expect(result).toEqual([]);
    });
  });

  describe('toDTOWithCategory', () => {
    it('should convert product with category name', () => {
      const product = makeProduct();

      const result = ProductPresenter.toDTOWithCategory(product, 'Category Name');

      expect(result).toEqual({
        id: 'product-id',
        name: 'Product name',
        description: 'Description',
        price: 100,
        stock: 10,
        image: 'image.png',
        categoryId: 'category-id',
        categoryName: 'Category Name',
      });
    });

    it('should omit categoryName when null', () => {
      const product = makeProduct();

      const result = ProductPresenter.toDTOWithCategory(product, null);

      expect(result.categoryName).toBeUndefined();
    });
  });
});
