import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { NestJSProductsController } from './controllers/nestjs-products.controller';
// import { DatabaseModule } from '../database/database.module';

@Module({
  // imports: [DatabaseModule],
  controllers: [
    HealthController,
    NestJSProductsController,
  ],
})

export class ApiModule {}
