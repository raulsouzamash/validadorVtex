# Validador de Catálogo VTEX

Aplicação web para auditoria de catálogo VTEX, identificando SKUs inaptos (Logística, Imagens e Cadastros).

## Funcionalidades

- **Upload Drag & Drop**: Suporte a planilhas Excel (.xlsx) da VTEX exportadas.
- **Validação de Imagens**: Cruzamento com lista de nomes de arquivos JPG.
- **Processamento em Background**: Uso de Web Workers para arquivos grandes (>20k linhas).
- **Interface Otimizada**: Tabela com Lazy Loading (Virtual Scroll) para performance.
- **Exportação de Erros**: Gera planilha com SKUs reprovados e motivo.

## Como Rodar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse**:
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Como Usar

1. Exporte a planilha de produtos/SKUs da VTEX.
2. Obtenha a lista de imagens do seu servidor (ex: `ls > imagens.txt`).
3. Arraste a planilha para a área de upload.
4. Cole a lista de imagens no campo de texto.
5. Clique em "Iniciar Auditoria".
6. Analise o dashboard e a tabela de erros.
7. Exporte o relatório se necessário.
