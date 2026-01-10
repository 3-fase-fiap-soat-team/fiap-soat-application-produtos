import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { Product } from 'src/core/products/entities/product';
import { ProductStock } from 'src/core/products/entities/value-objects/product-stock';

@Injectable()
export class DynamoProductRepository implements IProductDataSource {
  private table = process.env.DYNAMODB_TABLE_PRODUCTS || 'ProductsTable';

  constructor(@Inject('DDB_DOC') private ddb: DynamoDBDocumentClient) {}

  async save(product: Product): Promise<Product> {

    const item = {
      pk: `PRODUCT#${product.id}`,
      sk: 'METADATA',
      entity: 'product',
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      image: product.image,
      stock: product.stock?.value ?? 0,
      createdAt: product.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    };

    await this.ddb.send(new PutCommand({ TableName: this.table, Item: item }));
    return product;
  }

  async findAll(): Promise<Product[]> {
    const res: any = await this.ddb.send(
      new ScanCommand({
        TableName: this.table,
        FilterExpression: 'entity = :e',
        ExpressionAttributeValues: { ':e': 'product' },
      })
    );
    return (res.Items || []).map((i: any) => this.mapItemToProduct(i));
  }

  async findById(id: string): Promise<Product | null> {
    const res: any = await this.ddb.send(
      new GetCommand({ TableName: this.table, Key: { pk: `PRODUCT#${id}`, sk: 'METADATA' } })
    );
    if (!res.Item) return null;
    return this.mapItemToProduct(res.Item as any);
  }

  async delete(id: string): Promise<void> {
    await this.ddb.send(new DeleteCommand({ TableName: this.table, Key: { pk: `PRODUCT#${id}`, sk: 'METADATA' } }));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const res: any = await this.ddb.send(
      new QueryCommand({
        TableName: this.table,
        IndexName: 'gsi_category',
        KeyConditionExpression: 'categoryId = :c',
        ExpressionAttributeValues: { ':c': categoryId },
      })
    );
    return (res.Items || []).map((i: any) => this.mapItemToProduct(i));
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const results: Product[] = [];
    for (const id of ids) {
      const p = await this.findById(id);
      if (p) results.push(p);
    }
    return results;
  }

  async update(product: Product): Promise<void> {
    await this.save(product);
  }

  private mapItemToProduct(item: any): Product {
    return new Product(
      item.id,
      item.name,
      item.description,
      parseFloat(item.price),
      item.categoryId,
      new ProductStock(Number(item.stock ?? 0)),
      item.image ?? '',
      new Date(item.createdAt),
      new Date(item.updatedAt),
    );
  }
}
