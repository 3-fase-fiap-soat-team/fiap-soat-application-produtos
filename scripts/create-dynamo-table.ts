import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

async function ensureTable() {
  const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
  const region = process.env.AWS_REGION || 'us-east-1';
  const tableName = process.env.DYNAMODB_TABLE_PRODUCTS || 'ProductsTable';

  const client = new DynamoDBClient({ region, endpoint });

  try {
    // check table
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} already exists`);
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException' || err.$metadata?.httpStatusCode === 404) {
      console.log(`Creating table ${tableName}...`);
      const cmd = new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
          { AttributeName: 'categoryId', AttributeType: 'S' },
          { AttributeName: 'entity', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsi_category',
            KeySchema: [{ AttributeName: 'categoryId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
          {
            IndexName: 'entity-index',
            KeySchema: [{ AttributeName: 'entity', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      });

      const res = await client.send(cmd);
      console.log('CreateTable result:', res.TableDescription?.TableStatus);
    } else {
      console.error('DescribeTable error', err);
      process.exit(1);
    }
  }
}

ensureTable().catch((e) => {
  console.error(e);
  process.exit(1);
});
