import { Global, Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { DynamoProductRepository } from './repositories/dynamo-product.repository';
import { CryptoIdGenerator } from '../providers/crypto-id-generator';
import { IdGenerator } from 'src/interfaces/id-generator';

@Global()
@Module({
  providers: [
    {
      provide: 'DDB_CLIENT',
      useFactory: () => {
        return new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-east-1',
          endpoint: process.env.DYNAMODB_ENDPOINT,
          credentials: process.env.AWS_ACCESS_KEY_ID
            ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
              }
            : undefined,
        });
      },
    },
    {
      provide: 'DDB_DOC',
      inject: ['DDB_CLIENT'],
      useFactory: (client: DynamoDBClient) => DynamoDBDocumentClient.from(client),
    },
    {
      provide: IProductDataSource,
      useClass: DynamoProductRepository,
    },
    {
      provide: IdGenerator,
      useClass: CryptoIdGenerator,
    },
  ],
  exports: [IProductDataSource, 'DDB_DOC', IdGenerator],
})
export class DynamoModule {}
