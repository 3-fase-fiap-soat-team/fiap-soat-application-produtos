import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ListTablesCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';

// NOTE: We import types from @aws-sdk/client-dynamodb indirectly via the document client factory in DynamoModule

/**
 * Validates that all required environment variables are present
 * Fails fast on startup if any required variable is missing
 */
function validateEnvironment(): void {
  const required = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'NODE_ENV',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n💡 Tip: Check your .env.rds file or Kubernetes secrets');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`);
}

async function bootstrap() {
  // Validate environment before initializing the application
  // validateEnvironment();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('SOAT Tech Challenge')
    .setDescription("API's para sistema da lanchonete")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  try {
    const ddb = app.get<DynamoDBDocumentClient>('DDB_DOC');
    if (ddb) {
      const tableName = process.env.DYNAMODB_TABLE_PRODUCTS || 'ProductsTable';
      const list = await ddb.send(new ListTablesCommand({}));
      const exists = (list.TableNames || []).includes(tableName);
      if (!exists) {
        console.log(`Creating DynamoDB table ${tableName}...`);
        await ddb.send(
          new CreateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
              { AttributeName: 'pk', AttributeType: 'S' },
              { AttributeName: 'sk', AttributeType: 'S' },
              { AttributeName: 'entity', AttributeType: 'S' },
              { AttributeName: 'categoryId', AttributeType: 'S' },
            ],
            KeySchema: [
              { AttributeName: 'pk', KeyType: 'HASH' },
              { AttributeName: 'sk', KeyType: 'RANGE' },
            ],
            GlobalSecondaryIndexes: [
              {
                IndexName: 'entity-index',
                KeySchema: [{ AttributeName: 'entity', KeyType: 'HASH' }],
                Projection: { ProjectionType: 'ALL' },
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              },
              {
                IndexName: 'gsi_category',
                KeySchema: [{ AttributeName: 'categoryId', KeyType: 'HASH' }],
                Projection: { ProjectionType: 'ALL' },
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
              },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          }),
        );
        console.log(`DynamoDB table ${tableName} created.`);
      } else {
        console.log(`DynamoDB table ${tableName} already exists.`);
      }
    }
  } catch (err) {
    console.warn('DynamoDB table check/create failed (continuing startup):', err?.message || err);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on port ${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
