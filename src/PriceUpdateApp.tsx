import axios from "axios";
import { useState } from "react";

import TableItem from "./components/TableItem.tsx";
import TableEmpty from "./components/TableEmpty.tsx";

import { clearInputValue } from "./utils/utils.ts";
import { serverUrl, fileInputId } from "./config/constants.ts";

const PriceUpdateApp = () => {
  // Estado para armazenar os produtos atualizados do arquivo CSV
  const [updatedProducts, setupdatedProducts] = useState<object[]>([]);
  // Estado para controlar se é possível atualizar os dados no banco de dados
  const [canUpdate, setcanUpdate] = useState<boolean>(false);

  // Função para ler o arquivo CSV quando um arquivo é selecionado
  const readFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const csvFileReader: FileReader = new FileReader();

    csvFileReader.onload = async () => {
      // Limpa o valor do input do arquivo
      clearInputValue(fileInputId);

      // Lê as linhas do arquivo CSV e remove as aspas e apóstrofos
      let csvLines: string[] = csvFileReader.result
        ?.toString()
        .replace(/['"]+/g, "")
        .split("\n")!;
      csvLines.shift(); // Remove a primeira linha (cabeçalho)

      // Converte as linhas CSV em objetos JSON
      let parsedCsvData: object[] = csvLines.map((code) => {
        const [key, value] = code.split(",");

        return JSON.parse(`{"${key}":${value}}`);
      });

      try {
        // Envia os dados para o servidor via Axios
        const res = await axios.post(serverUrl, parsedCsvData);
        // Verifica se há erros em algum produto nos dados recebidos
        const hasError: boolean = res.data.some(
          (product: any) => product.error != null
        );
        if (hasError) {
          alert(
            "Erros encontrados no arquivo, por favor verifique-o e tente novamente"
          );
        }

        // Atualiza o estado 'canUpdate' com base na presença de erros para evitar a atualização com valores invalidos
        setcanUpdate(!hasError);
        // Atualiza o estado 'updatedProducts' com os dados recebidos do servidor
        setupdatedProducts(res.data);
      } catch (error: any) {
        // Lida com erros de requisição
        alert(error.response.data);
      }
    };

    // Lê o arquivo quando um arquivo é selecionado
    if (evt.currentTarget.files != null) {
      csvFileReader.readAsText(evt.currentTarget.files[0]);
    }
  };

  // Função para salvar as mudanças no banco de dados
  const saveChangesToDb = async () => {
    try {
      // Envia os dados atualizados para o servidor via Axios
      const res = await axios.post(`${serverUrl}/save`, updatedProducts);
      // Limpa o valor do input do arquivo
      clearInputValue(fileInputId);

      if (res.data.error) {
        // Lida com erros de resposta do servidor
        return alert(res.data.msgError);
      }

      // Exibe uma mensagem de sucesso
      alert(res.data.msg);

      // Limpa os produtos atualizados e redefine 'canUpdate' para falso
      setupdatedProducts([]);
      setcanUpdate(false);
    } catch (error: any) {
      // Lida com erros de requisição
      alert(error.response.data);
    }
  };

  return (
    <div className="container">
      <header>
        {/* Título da página */}
        <h1>Atualizar Preços</h1>
        <div></div>
        {!canUpdate ? (
          // Botão para carregar arquivo CSV
          <label className="button" htmlFor="file-upload">
            CARREGAR ARQUIVO
          </label>
        ) : (
          // Botão para atualizar os dados no banco de dados
          <label className="button" onClick={saveChangesToDb}>
            ATUALIZAR
          </label>
        )}
      </header>
      <main>
        <div>
          <table>
            <tbody>
              <tr>
                {/* Cabeçalho da tabela */}
                <th>Código</th>
                <th>Nome</th>
                <th>Preço Atual</th>
                <th>Novo Preço</th>
                <th>Erro (Caso houver)</th>
              </tr>
              {/* Mapeia e exibe os produtos atualizados na tabela */}
              {updatedProducts.map((product: any) => (
                <TableItem key={product.code} product={product} />
              ))}
              {/* Linhas vazias para preencher a tabela */}
              <TableEmpty productsQty={updatedProducts.length} />
            </tbody>
          </table>
        </div>
      </main>
      {canUpdate ? (
        // Botão para atualizar os dados no banco de dados
        <label className="bottom-button" onClick={saveChangesToDb}>
          ATUALIZAR
        </label>
      ) : (
        // Botão para carregar arquivo CSV
        <label className="bottom-button" htmlFor="file-upload">
          CARREGAR ARQUIVO
        </label>
      )}
      {/* Input de arquivo para selecionar arquivos CSV */}
      <input id="file-upload" type="file" accept=".csv" onChange={readFile} />
    </div>
  );
};

export default PriceUpdateApp;
