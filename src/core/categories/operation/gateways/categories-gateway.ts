import { Category } from '../../entities/category';

export interface CategoryGateway {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}
