import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { NestJSProductsController } from './controllers/nestjs-products.controller';
import { ICategoryClient } from 'src/interfaces/category-client.interface';
import { HttpCategoryClient } from '../clients/http-category.client';
// import { DatabaseModule } from '../database/database.module';

@Module({
  // imports: [DatabaseModule],
  controllers: [
    HealthController,
    NestJSProductsController,
  ],
  providers: [
    {
      provide: ICategoryClient,
      useClass: HttpCategoryClient,
    },
  ],
})

export class ApiModule {}
