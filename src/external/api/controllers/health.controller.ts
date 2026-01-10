import { Controller, Get, Inject } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';

@Controller('health')
export class HealthController {
  constructor(
    @Inject('DDB_DOC')
    private readonly ddbDoc: DynamoDBDocumentClient,
  ) {}

  @Get()
  async getHealth() {
    try {
      // quick ping: list tables with limit 1
      await this.ddbDoc.send(new ListTablesCommand({ Limit: 1 } as any));
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'dynamodb',
      };
    } catch (err: any) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'dynamodb',
        error: err?.message || String(err),
      };
    }
  }

  @Get('database')
  async getDatabaseHealth() {
    try {
      const res = await this.ddbDoc.send(new ListTablesCommand({ Limit: 10 } as any));
      return {
        status: 'healthy',
        tablesCount: Array.isArray(res.TableNames) ? res.TableNames.length : 0,
        tables: res.TableNames ?? [],
      };
    } catch (err: any) {
      return {
        status: 'unhealthy',
        error: err?.message || String(err),
      };
    }
  }
}