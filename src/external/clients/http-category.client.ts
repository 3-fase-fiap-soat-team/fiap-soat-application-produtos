import { Injectable, Logger } from '@nestjs/common';
import { ICategoryClient, CategoryResponse } from 'src/interfaces/category-client.interface';

@Injectable()
export class HttpCategoryClient implements ICategoryClient {
  private readonly logger = new Logger(HttpCategoryClient.name);
  private readonly categoriesServiceUrl: string;

  constructor() {
    this.categoriesServiceUrl = 
      process.env.CATEGORIAS_SERVICE_URL || 
      'http://fiap-soat-categorias.fiap-soat-app.svc.cluster.local:3000';
  }

  async findById(id: string): Promise<CategoryResponse | null> {
    try {
      this.logger.log(`Buscando categoria com ID: ${id} em ${this.categoriesServiceUrl}`);
      
      const response = await fetch(`${this.categoriesServiceUrl}/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          this.logger.warn(`Categoria não encontrada: ${id}`);
          return null;
        }
        throw new Error(`Erro ao buscar categoria: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.log(`Categoria encontrada: ${data.name}`);
      
      return {
        id: data.id,
        name: data.name,
      };
    } catch (error) {
      this.logger.error(`Erro ao comunicar com serviço de categorias: ${error.message}`);
      // Em caso de erro de comunicação, retorna null para não quebrar o fluxo
      return null;
    }
  }
}
