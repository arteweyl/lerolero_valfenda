# Lero Lero de Valfenda

Aplicação para gerar reprimendas longas, fantásticas, pomposas e excessivamente eruditas no estilo elfo-medieval de Valfenda (Rivendell).

O MVP original foi refatorado para oferecer duas novas formas de deploy e execução: **uma versão totalmente containerizada** (frontend + backend em uma única imagem Docker) e **uma edição estática minimalista em HTML puro** ideal para o GitHub Pages.

---

## 🚀 Entregável 1: Versão Containerizada (Docker)

Esta versão constrói a aplicação React em ambiente isolado de produção e serve os arquivos estáticos através do próprio servidor API Node.js (que agora atua como servidor estático unificado na porta `3333`).

### 📦 Como executar com Docker Compose (Recomendado)

O Compose está configurado para subir dois containers interligados pela rede interna do Docker:
- **`lero-lero-valfenda`**: O app unificado (Node.js + React estático).
- **`ollama-service`**: O container oficial do Ollama.

1. Inicie a stack de containers:
   ```bash
   docker compose up -d --build
   ```
2. Acesse a aplicação no navegador em:
   ```text
   http://localhost:3333
   ```
3. Baixe o modelo `qwen2.5:3b` necessário:
   * **Via Interface Web (Mais fácil):** Vá em **Configurar IA** (no topo da página) e clique no botão **Baixar Modelo**. O download começará a ser transmitido e gravado diretamente no volume persistente `lero-lero-ollama-data`.
   * **Via Linha de Comando:** Execute o comando abaixo no terminal para mandar o container do Ollama fazer o download:
     ```bash
     docker exec -it ollama-service ollama pull qwen2.5:3b
     ```

> [!TIP]
> Os modelos baixados ficam armazenados em um volume Docker nomeado chamado `lero-lero-ollama-data` para evitar que você precise baixar o modelo novamente se recriar os containers.

### 🐳 Como executar apenas com Dockerfile (Conectando a um Ollama externo)

Se preferir rodar apenas o container da aplicação de forma isolada, conectando ao Ollama rodando direto na sua máquina física (fora do Docker):
```bash
# 1. Construir a imagem
docker build -t lero-lero-valfenda .

# 2. Executar passando o IP da máquina física através do gateway
docker run -d -p 3333:3333 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  --add-host=host.docker.internal:host-gateway \
  lero-lero-valfenda
```

---

## 🌐 Entregável 2: Versão Estática (GitHub Pages)

Uma versão super simplificada, compacta e elegante em **HTML puro + Vanilla JS** foi desenvolvida para rodar totalmente no navegador do usuário e ser facilmente hospedada no GitHub Pages ou em qualquer servidor estático sem backend Node.js.

### 📂 Onde está
Os arquivos estão na pasta [github-pages/](file:///mnt/c/Users/lcwey/projetos_pessoais/lero-lero-valfenda/github-pages/):
- [index.html](file:///mnt/c/Users/lcwey/projetos_pessoais/lero-lero-valfenda/github-pages/index.html) - Arquivo único auto-contido contendo HTML, CSS (elven design premium) e JavaScript com suporte a offline local database.

### 🌟 Recursos Especiais desta Versão
- **Banco de Dados Local (Amdir/Estel):** Se o Ollama estiver offline, a página funciona 100% no modo offline sorteando citações locais guardadas em pergaminhos estáticos.
- **Chamada Direta do Navegador para a IA Local:** Permite que o próprio navegador converse diretamente com o Ollama local na porta `11434` (sem intermediar por um servidor Node.js).
- **Download do Modelo via Browser:** Se você estiver com o Ollama ativo, mas sem o modelo, o próprio HTML estático gerencia a barra de progresso do download do modelo usando Streams.

### ⚠️ Configuração Obrigatória de CORS no Ollama
Para que seu navegador (no GitHub Pages, ex: `seunome.github.io`) possa se comunicar com o Ollama local (`11434`), você **precisa liberar as requisições de CORS**.

1. Feche o Ollama da bandeja do sistema (perto do relógio).
2. Abra o terminal e execute:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
3. Acesse a sua página estática e abra as configurações (Santuário de IA) para validar se a conexão foi estabelecida.

---

## 🛠️ Como rodar o ambiente de desenvolvimento clássico

Se você preferir rodar no modo de desenvolvimento separado (React + API local):

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Em um terminal, inicie a API local:
   ```bash
   npm run dev:api
   ```
3. Em outro terminal, inicie o servidor do frontend Vite:
   ```bash
   npm run dev
   ```
4. Abra no navegador:
   ```text
   http://127.0.0.1:5173
   ```
