import { defineFeature, loadFeature } from 'jest-cucumber';
import { NotFoundException } from '@nestjs/common';
import { NestJSProductsController } from 'src/external/api/controllers/nestjs-products.controller';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { IdGenerator } from 'src/interfaces/id-generator';
import { ICategoryClient } from 'src/interfaces/category-client.interface';

const feature = loadFeature(
  'features/products/get-product-by-id.feature'
);

defineFeature(feature, (test) => {
  let controller: NestJSProductsController;
  let error: any;

  const productDataSource = {
    findById: jest.fn(),
  } as unknown as IProductDataSource;

  const idGenerator = {} as IdGenerator;
  const categoryClient = {} as ICategoryClient;

  test('Produto não encontrado', ({ given, when, then, and }) => {

    given(/^que não existe um produto com o id "(.+)"$/, async (id) => {
      productDataSource.findById = jest.fn().mockResolvedValue(null);

      controller = new NestJSProductsController(
        productDataSource,
        idGenerator,
        categoryClient
      );
    });

    when(/^o cliente requisita o produto pelo id "(.+)"$/, async (id) => {
      try {
        await controller.findById(id);
      } catch (e) {
        error = e;
      }
    });

    then('o sistema deve retornar erro 404', () => {
      expect(error).toBeInstanceOf(NotFoundException);
    });

    and(/^a mensagem deve ser "(.+)"$/, (message) => {
      expect(error.message).toBe(message);
    });

  });
});
