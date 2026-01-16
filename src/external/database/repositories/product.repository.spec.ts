import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from 'src/core/products/entities/product';
import { ProductMapper } from '../mappers/product.mapper';
import { OrmProductRepository } from './product.repository';

describe('OrmProductRepository', () => {
  let repository: jest.Mocked<Repository<ProductEntity>>;
  let ormRepository: OrmProductRepository;

  const product = {} as Product;
  const entity = {} as ProductEntity;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    } as any;

    ormRepository = new OrmProductRepository(repository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('save', () => {
    it('should persist and return domain product', async () => {
      jest.spyOn(ProductMapper, 'toPersistence').mockReturnValue(entity);
      jest.spyOn(ProductMapper, 'toDomain').mockReturnValue(product);
      repository.save.mockResolvedValue(entity);

      const result = await ormRepository.save(product);

      expect(ProductMapper.toPersistence).toHaveBeenCalledWith(product);
      expect(repository.save).toHaveBeenCalledWith(entity as any);
      expect(ProductMapper.toDomain).toHaveBeenCalledWith(entity);
      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    it('should return mapped products', async () => {
      repository.find.mockResolvedValue([entity]);
      jest.spyOn(ProductMapper, 'toDomain').mockReturnValue(product);

      const result = await ormRepository.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([product]);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      repository.findOne.mockResolvedValue(entity);
      jest.spyOn(ProductMapper, 'toDomain').mockReturnValue(product);

      const result = await ormRepository.findById('id');

      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toBe(product);
    });

    it('should return null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await ormRepository.findById('id');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete product by id', async () => {
      repository.delete.mockResolvedValue(undefined as any);

      await ormRepository.delete('id');

      expect(repository.delete).toHaveBeenCalledWith('id');
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      repository.find.mockResolvedValue([entity]);
      jest.spyOn(ProductMapper, 'toDomain').mockReturnValue(product);

      const result = await ormRepository.findByCategory('category-id');

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([product]);
    });
  });

  describe('findManyByIds', () => {
    it('should return products by ids', async () => {
      repository.find.mockResolvedValue([entity]);
      jest.spyOn(ProductMapper, 'toDomain').mockReturnValue(product);

      const result = await ormRepository.findManyByIds(['id']);

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([product]);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      jest.spyOn(ProductMapper, 'toPersistence').mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      await ormRepository.update(product);

      expect(ProductMapper.toPersistence).toHaveBeenCalledWith(product);
      expect(repository.save).toHaveBeenCalledWith(entity as any);
    });
  });
});
