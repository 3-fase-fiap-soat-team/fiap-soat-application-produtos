import { Repository, In } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from 'src/core/products/entities/product';
import { ProductMapper } from '../mappers/product.mapper';

export class OrmProductRepository {
  constructor(private readonly repository: Repository<ProductEntity>) {}

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toPersistence(product);
    const saved = await this.repository.save(entity as any);
    return ProductMapper.toDomain(saved as ProductEntity);
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.repository.find();
    return rows.map((r) => ProductMapper.toDomain(r));
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.repository.findOne({ where: { id } as any });
    if (!row) return null;
    return ProductMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const rows = await this.repository.find({ where: { category_id: categoryId } as any });
    return rows.map((r) => ProductMapper.toDomain(r));
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const rows = await this.repository.find({ where: { id: In(ids) } as any });
    return rows.map((r) => ProductMapper.toDomain(r));
  }

  async update(product: Product): Promise<void> {
    await this.repository.save(ProductMapper.toPersistence(product) as any);
  }
}
