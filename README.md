# Lero Lero de Valfenda

Gerador de reprimendas pomposas e excessivamente eruditas no estilo elfo-medieval de Valfenda (Rivendell).

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
3. Como o GitHub Pages roda sob **HTTPS** e o Ollama local roda sob **HTTP**, o navegador bloqueará as chamadas por padrão (Insecure/Mixed Content) além do bloqueio de CORS. Escolha uma das opções abaixo para conectar:

<br>

<details>
<summary><b>👉 Opção 1: Permitir Conteúdo Não Seguro no Navegador (Mais Rápida)</b></summary>

Você pode abrir uma exceção de segurança de conteúdo misto apenas para a página do seu projeto no GitHub Pages:

1. Acesse o seu site no **GitHub Pages**.
2. Clique no **ícone de cadeado ou configurações** (duas barras de controles deslizantes) no lado esquerdo da barra de endereço (onde fica a URL do site).
3. Selecione **"Configurações do site"** (ou *Site settings*).
4. Localize a opção **"Conteúdo não seguro"** (ou *Insecure content*) e mude de *Bloquear* para **"Permitir"** (ou *Allow*).
5. Retorne à página do GitHub Pages e **recarregue (F5)**.

> ⚠️ **Atenção:** Você ainda precisará liberar o CORS no Ollama (veja a aba "Como liberar o CORS no Ollama" abaixo).
</details>

<details>
<summary><b>👉 Opção 2: Criar um túnel seguro HTTPS para o Ollama (Sem mexer no navegador)</b></summary>

Se você preferir não alterar as políticas do seu navegador, pode expor o seu Ollama local usando um túnel HTTPS criptografado (ex: `localtunnel` ou `ngrok`):

1. Instale o localtunnel globalmente via npm:
   ```bash
   npm install -g localtunnel
   ```
2. Inicie o túnel direcionado para a porta do seu Ollama local:
   ```bash
   lt --port 11434
   ```
3. O comando irá gerar um link seguro parecido com `https://xxxxx.localthunnel.me`. Copie este link.
4. Abra o site no GitHub Pages, vá em **Configurações / Configurar IA** e cole essa URL HTTPS no campo de endereço do Ollama.
</details>

<details>
<summary><b>👉 Opção 3: Executar a Aplicação Localmente por HTTP</b></summary>

Se quiser evitar túneis e exceções de segurança, basta rodar o projeto localmente. Como a página será servida em `http://localhost:5173`, o navegador permitirá a comunicação direta com o Ollama local sem restrições de HTTPS:

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
</details>

<details>
<summary><b>🔒 Como liberar o CORS no seu Ollama (Obrigatório)</b></summary>

Para o navegador permitir conexões vindas do domínio do GitHub Pages, o Ollama local precisa subir com a permissão de CORS ativada (`OLLAMA_ORIGINS="*"`).

* **No WSL2 (Serviço Systemd):**
  1. Abra o arquivo de substituição do serviço:
     ```bash
     sudo systemctl edit ollama.service
     ```
  2. Adicione as seguintes linhas no arquivo:
     ```ini
     [Service]
     Environment="OLLAMA_ORIGINS=*"
     ```
  3. Salve, feche o editor e atualize o serviço:
     ```bash
     sudo systemctl daemon-reload && sudo systemctl restart ollama
     ```

* **No Windows (Executando diretamente pelo CMD ou PowerShell):**
  1. Feche o Ollama clicando com o botão direito no ícone dele na barra de tarefas (perto do relógio) e escolhendo **Quit**.
  2. Abra um terminal e execute:
     ```powershell
     set OLLAMA_ORIGINS=*
     ollama serve
     ```
</details>

<br>

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

O projeto inclui um servidor MCP localizado em [mcp-server/index.mjs](file:///mnt/c/Users/lcwey/projetos_pessoais/lero-lero-valfenda/mcp-server/index.mjs). Ele foi projetado para que **você** (o usuário) possa integrar seus assistentes de IA pessoais (como Cursor, Claude Desktop ou extensões de VSCode) diretamente com o contexto da aplicação (seja ela rodando localmente ou de forma containerizada).

Ao conectar o seu assistente de IA a este servidor MCP, você poderá delegar e escolher qual LLM utilizar na geração das reprimendas:
- **Ollama (Local/Containerizado)**: Executa a geração localmente na sua máquina (ex: na GPU GTX 1650).
- **Gemini Cloud (Nuvem)**: Executa na nuvem para maior precisão e tarefas complexas.
- **Roteamento Inteligente**: O servidor MCP escolhe automaticamente a melhor LLM com base na complexidade do prompt.

Para ver instruções detalhadas de como configurar o servidor MCP no seu assistente e recomendações de hardware para rodar local na GPU GTX 1650, consulte o [README do mcp-server](file:///mnt/c/Users/lcwey/projetos_pessoais/lero-lero-valfenda/mcp-server/README.md).
