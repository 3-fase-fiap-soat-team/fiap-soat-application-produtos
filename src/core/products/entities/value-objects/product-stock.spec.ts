import { ProductStock } from './product-stock';

describe('ProductStock Value Object', () => {
  describe('constructor', () => {
    it('should create a valid stock with integer value', () => {
      const stock = new ProductStock(10);

      expect(stock).toBeInstanceOf(ProductStock);
      expect(stock.value).toBe(10);
    });

    it('should allow zero stock', () => {
      const stock = new ProductStock(0);

      expect(stock.value).toBe(0);
    });

    it('should throw if value is negative', () => {
      expect(() => new ProductStock(-1)).toThrow(
        'O estoque deve ser um número inteiro positivo.',
      );
    });

    it('should throw if value is not an integer', () => {
      expect(() => new ProductStock(1.5)).toThrow(
        'O estoque deve ser um número inteiro positivo.',
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal stock values', () => {
      const stock1 = new ProductStock(5);
      const stock2 = new ProductStock(5);

      expect(stock1.equals(stock2)).toBe(true);
    });

    it('should return false for different stock values', () => {
      const stock1 = new ProductStock(5);
      const stock2 = new ProductStock(3);

      expect(stock1.equals(stock2)).toBe(false);
    });

    it('should return false when comparing with non ProductStock', () => {
      const stock = new ProductStock(5);

      expect(stock.equals(null as any)).toBe(false);
      expect(stock.equals({ value: 5 } as any)).toBe(false);
    });
  });

  describe('increase', () => {
    it('should increase stock quantity', () => {
      const stock = new ProductStock(5);

      const result = stock.increase(3);

      expect(result.value).toBe(8);
      expect(result).not.toBe(stock);
    });

    it('should throw if quantity is negative', () => {
      const stock = new ProductStock(5);

      expect(() => stock.increase(-1)).toThrow(
        'A quantidade para adicionar deve ser positiva.',
      );
    });
  });

  describe('decrease', () => {
    it('should decrease stock quantity', () => {
      const stock = new ProductStock(5);

      const result = stock.decrease(3);

      expect(result.value).toBe(2);
      expect(result).not.toBe(stock);
    });

    it('should throw if quantity is negative', () => {
      const stock = new ProductStock(5);

      expect(() => stock.decrease(-1)).toThrow(
        'A quantidade para remover deve ser positiva.',
      );
    });

    it('should throw if quantity is greater than stock', () => {
      const stock = new ProductStock(3);

      expect(() => stock.decrease(5)).toThrow(
        'A quantidade para remover é maior que a quantidade em estoque.',
      );
    });
  });
});
