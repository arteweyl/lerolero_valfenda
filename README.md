# Lero Lero de Valfenda

Gerador de reprimendas pomposas e excessivamente eruditas no estilo elfo-medieval de Valfenda (Rivendell).

A aplicação pode ser executada em três modos diferentes:
1. **Docker (Multi-container)**: Roda o app web e um container do Ollama integrados na mesma rede Docker.
2. **GitHub Pages (Estático)**: Página única em HTML puro para rodar direto no navegador (com base local de 200 frases).
3. **Desenvolvimento Local**: Executa o frontend (Vite/React) e o backend (Node.js) de forma independente para desenvolvimento.

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
3. Para conectar o navegador ao seu Ollama local, inicialize o serviço do Ollama permitindo conexões de CORS:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
   E insira o endereço `http://127.0.0.1:11434` no menu de configurações (Santuário de IA) da página.

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
