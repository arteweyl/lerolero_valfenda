# Lero Lero de Valfenda

Gerador de reprimendas pomposas e excessivamente eruditas no estilo elfo-medieval de Valfenda (Rivendell). É um experimento de produto e linguagem: funciona offline com uma base local e oferece geração opcional com modelos locais, sem exigir que quem visita a página pública forneça credenciais.

A aplicação pode ser executada e integrada de quatro formas diferentes:
1. **Docker (Multi-container)**: Roda o app web e um container do Ollama integrados na mesma rede Docker.
2. **GitHub Pages (Estático)**: Página única em HTML puro para rodar direto no navegador (com base local de 200 frases e suporte a chaves cloud).
3. **Desenvolvimento Local**: Executa o frontend (Vite/React) e o backend (Node.js) de forma independente para desenvolvimento.
4. **Servidor MCP**: Integra o projeto com assistentes de IA externos para gerenciar/rotear consultas entre o Gemini (Nuvem) e o Ollama (Local).

---

## 🐳 Executando com Docker

O setup está configurado via Docker Compose para subir a aplicação web juntamente com o serviço do Ollama em containers separados na mesma rede.

1. Suba a stack de containers:
   ```bash
   docker compose up -d --build
   ```
2. Acesse a aplicação no navegador em:
   ```text
   http://localhost:3333
   ```
3. Baixe o modelo `qwen2.5:3b` necessário:
   * **Via Linha de Comando:**
     ```bash
     docker exec -it ollama-service ollama pull qwen2.5:3b
     ```
   * **Via Interface Web:** Vá em **Configurar IA** no topo da página e clique no botão **Baixar Modelo** para acompanhar o download por lá.

*Os modelos baixados são persistidos no volume Docker `lero-lero-ollama-data`.*

### Rodando apenas o app em container (Ollama Externo)
Se você já tem o Ollama instalado no sistema operacional do seu host físico e quer apenas rodar o container do app web:
```bash
docker build -t lero-lero-valfenda .
docker run -d -p 3333:3333 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  --add-host=host.docker.internal:host-gateway \
  lero-lero-valfenda
```

---

## 🌐 Executando no GitHub Pages (Página Estática)

A pasta `github-pages/` contém uma versão estática minimalista em HTML puro e Vanilla JS, ideal para deploy rápido.

1. Configure o deploy da pasta `github-pages/` nas configurações do GitHub Pages do seu repositório.
2. O app funciona 100% offline usando uma base de dados local de 200 frases élvicas.
3. A versão publicada permanece offline por padrão. Para usar Ollama, execute a aplicação localmente ou pela stack Docker. Não reduza as proteções do navegador e não exponha a porta local do Ollama à internet.

### Executar localmente com Ollama

Em desenvolvimento, a página será servida em `http://localhost:5173` e poderá se comunicar com o Ollama local:

1. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/valfenda/lero-lero-valfenda.git
   cd lero-lero-valfenda
   npm install
   ```
2. Inicie o servidor local:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:5173` no navegador.
---

## 💻 Desenvolvimento Local

Para rodar o ambiente de desenvolvimento clássico:

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Em um terminal, inicie a API de desenvolvimento:
   ```bash
   npm run dev:api
   ```
3. Em outro terminal, inicie o servidor do frontend Vite:
   ```bash
   npm run dev
   ```
4. Abra no navegador em:
   ```text
   http://127.0.0.1:5173
   ```

---

## 🔌 Servidor MCP (Model Context Protocol)

O projeto inclui um servidor MCP localizado em [`mcp-server/index.mjs`](mcp-server/index.mjs). Ele foi projetado para que **você** (o usuário) possa integrar seus assistentes de IA pessoais (como Cursor, Claude Desktop ou extensões de VSCode) diretamente com o contexto da aplicação (seja ela rodando localmente ou de forma containerizada).

Ao conectar o seu assistente de IA a este servidor MCP, você poderá delegar e escolher qual LLM utilizar na geração das reprimendas:
- **Ollama (Local/Containerizado)**: Executa a geração localmente na sua máquina (ex: na GPU GTX 1650).
- **Gemini Cloud (Nuvem)**: Executa na nuvem para maior precisão e tarefas complexas.
- **Roteamento Inteligente**: O servidor MCP escolhe automaticamente a melhor LLM com base na complexidade do prompt.

Para ver instruções detalhadas de como configurar o servidor MCP no seu assistente e recomendações de hardware para rodar local na GPU GTX 1650, consulte o [README do mcp-server](mcp-server/README.md).
