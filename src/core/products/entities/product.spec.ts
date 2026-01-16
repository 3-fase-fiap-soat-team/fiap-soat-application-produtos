import { Product } from './product';
import { ProductStock } from './value-objects/product-stock';

describe('Product Entity', () => {
  const validStock = new ProductStock(10);
  const baseDate = new Date('2024-01-01');

  const makeProduct = (overrides?: Partial<Product>) => {
    return new Product(
      'product-id',
      overrides?.name ?? 'Product name',
      overrides?.description ?? 'Product description',
      overrides?.price ?? 100,
      overrides?.categoryId ?? 'category-id',
      overrides?.stock ?? validStock,
      overrides?.image ?? 'image.png',
      overrides?.createdAt ?? baseDate,
      overrides?.updatedAt ?? baseDate,
    );
  };

  describe('constructor validation', () => {
    it('should create a valid product', () => {
      const product = makeProduct();

      expect(product).toBeInstanceOf(Product);
      expect(product.name).toBe('Product name');
      expect(product.price).toBe(100);
    });

    it('should throw if name is empty', () => {
      expect(() => makeProduct({ name: '' })).toThrow(
        'O nome do produto é obrigatório.',
      );
    });

    it('should throw if description is empty', () => {
      expect(() => makeProduct({ description: '' })).toThrow(
        'A descrição do produto é obrigatória.',
      );
    });

    it('should throw if categoryId is empty', () => {
      expect(() => makeProduct({ categoryId: '' })).toThrow(
        'O ID da categoria é obrigatório.',
      );
    });

    it('should throw if price is zero or negative', () => {
      expect(() => makeProduct({ price: 0 })).toThrow(
        'O preço do produto é obrigatório e deve ser maior que zero.',
      );

      expect(() => makeProduct({ price: -1 })).toThrow(
        'O preço do produto é obrigatório e deve ser maior que zero.',
      );
    });

    it('should throw if stock is not provided', () => {
      expect(() => makeProduct({ stock: undefined })).toThrow(
        'O estoque é obrigatório.',
      );
    });
  });

  describe('changeName', () => {
    it('should change name and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;

      product.changeName('New name');

      expect(product.name).toBe('New name');
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });

    it('should throw if name is empty', () => {
      const product = makeProduct();

      expect(() => product.changeName('')).toThrow(
        'O nome do produto é obrigatório.',
      );
    });
  });

  describe('changeDescription', () => {
    it('should change description and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;

      product.changeDescription('New description');

      expect(product.description).toBe('New description');
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });

    it('should throw if description is empty', () => {
      const product = makeProduct();

      expect(() => product.changeDescription('')).toThrow(
        'A descrição do produto é obrigatória.',
      );
    });
  });

  describe('changePrice', () => {
    it('should change price and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;

      product.changePrice(200);

      expect(product.price).toBe(200);
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });

    it('should throw if price is invalid', () => {
      const product = makeProduct();

      expect(() => product.changePrice(0)).toThrow(
        'O preço do produto é obrigatório e deve ser maior que zero.',
      );
    });
  });

  describe('changeCategoryId', () => {
    it('should change categoryId and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;

      product.changeCategoryId('new-category-id');

      expect(product.categoryId).toBe('new-category-id');
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });

    it('should throw if categoryId is empty', () => {
      const product = makeProduct();

      expect(() => product.changeCategoryId('')).toThrow(
        'O ID da categoria é obrigatório.',
      );
    });
  });

  describe('changeStock', () => {
    it('should change stock and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;
      const newStock = new ProductStock(5);

      product.changeStock(newStock);

      expect(product.stock).toBe(newStock);
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });

    it('should throw if stock is not provided', () => {
      const product = makeProduct();

      expect(() => product.changeStock(null as any)).toThrow(
        'O estoque é obrigatório.',
      );
    });
  });

  describe('changeImage', () => {
    it('should change image and update updatedAt', () => {
      const product = makeProduct();
      const oldUpdatedAt = product.updatedAt;

      product.changeImage('new-image.png');

      expect(product.image).toBe('new-image.png');
      expect(product.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });
  });
});
