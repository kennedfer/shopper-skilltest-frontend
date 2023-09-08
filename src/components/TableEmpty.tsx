import { TableEmptyProps } from "../interfaces/interfaces";

/**
 * Componente que renderiza linhas vazias em uma tabela.
 * @param {number} productsQty - O número de produtos atualmente na tabela.
 */
const TableEmpty = ({ productsQty }: TableEmptyProps): JSX.Element[] | null => {
  // Define o número máximo de linhas vazias que podem ser renderizadas
  const maxRows: number = 20;
  // Calcula a quantidade de linhas vazias a serem renderizadas
  const emptyRowsCount: number = maxRows - productsQty;

  // Retorna 'null' se o número de produtos for maior ou igual ao máximo de linhas
  if (productsQty >= maxRows) return null;

  // Cria um array de linhas vazias com base na quantidade calculada
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, i) => (
    <tr key={"empty-item" + i}>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  ));

  // Retorna as linhas vazias
  return emptyRows;
};

export default TableEmpty;
