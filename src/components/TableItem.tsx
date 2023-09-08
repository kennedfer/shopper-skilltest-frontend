import { Product } from "../interfaces/interfaces";

// Componente TableItem responsável por exibir os detalhes de um produto em uma linha de tabela.
const TableItem = (props: { product: Product }): JSX.Element => {
  // Extrai as propriedades do objeto 'product' para variáveis individuais.
  const { code, name, sales_price, new_price, error } = props.product;

  // Cria um array com as propriedades do produto para exibição nas células da tabela.
  const productProperties = [code, name, sales_price, new_price, error];

  // Função para lidar com o clique em uma linha de preço com erro, exibindo um alerta.
  const onClickErr = (err: string): void => alert(err);

  return (
    <tr
      // Aplica uma classe 'price-error' se houver um erro no preço, caso contrário, deixa vazio.
      className={error ? "price-error" : ""}
      // Configura um clique para exibir um alerta com o erro, se houver um erro.
      onClick={error ? () => onClickErr(error) : () => {}}
    >
      {/* Mapeia e exibe as propriedades do produto em células da tabela. */}
      {productProperties.map(
        (property: string | number | undefined, i: number) => (
          <td key={i}>{property}</td>
        )
      )}
    </tr>
  );
};

export default TableItem;
