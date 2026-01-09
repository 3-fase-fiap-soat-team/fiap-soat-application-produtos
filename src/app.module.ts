import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoModule } from './external/database/dynamo.module';
import { ApiModule } from './external/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamoModule,
    ApiModule,
  ],
  controllers: [],
})
export class AppModule {}
