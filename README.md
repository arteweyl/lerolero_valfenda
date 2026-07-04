# Lero Lero de Valfenda

Aplicacao React para gerar reprimendas longas, fantasticas e excessivamente eruditas.

O MVP usa Ollama local para gerar novos textos com LLM e mantem fallback offline com frases locais.

## Requisitos

- Node.js 20 ou superior.
- npm 10 ou superior.
- Ollama instalado e rodando em `http://127.0.0.1:11434`.

Para CPU sem placa de video, o modelo padrao recomendado para este exemplo e `qwen2.5:3b`: ele fica na faixa de 3B parametros, que costuma equilibrar qualidade e custo local melhor do que modelos grandes.

## Configurar o modelo

Instale o Ollama e baixe o modelo:

```bash
ollama pull qwen2.5:3b
```

Opcionalmente copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Variaveis aceitas:

```text
API_PORT=3333
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b
```

## Rodar localmente

```bash
npm install
```

Em um terminal, suba a API local:

```bash
npm run dev:api
```

Em outro terminal, suba o frontend:

```bash
npm run dev
```

Depois abra:

```text
http://127.0.0.1:5173
```

## Scripts

```bash
npm run dev
npm run dev:api
npm run build
npm run preview
```

## Estrutura

```text
src/App.tsx
src/main.tsx
src/styles.css
server/index.mjs
```
