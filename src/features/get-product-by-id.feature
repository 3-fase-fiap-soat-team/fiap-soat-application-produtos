Feature: Buscar produto por ID

  Scenario: Produto não encontrado
    Given que não existe um produto com o id "123"
    When o cliente requisita o produto pelo id "123"
    Then o sistema deve retornar erro 404
    And a mensagem deve ser "Produto não encontrado"
