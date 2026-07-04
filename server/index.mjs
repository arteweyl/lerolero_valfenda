import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadLocalEnv() {
  try {
    const envFile = readFileSync(join(process.cwd(), '.env'), 'utf8');

    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional for this local MVP.
  }
}

loadLocalEnv();

const PORT = Number.parseInt(process.env.API_PORT ?? '3333', 10);
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:3b';

const CATEGORIES = {
  genealogy: 'genealogia, linhagens antigas, reis esquecidos, pergaminhos e arvores familiares impossiveis',
  nature: 'natureza, florestas, rios, montanhas, ervas, estacoes e observacao paciente do mundo',
  philosophy: 'filosofia, destino, tempo, humildade, poder, esperanca e julgamento precipitado',
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

function buildPrompt(category) {
  const theme = CATEGORIES[category] ?? CATEGORIES.genealogy;

  return [
    'Voce e um gerador de "lero lero de Valfenda".',
    'Escreva uma unica reprimenda longa, pomposa e engracada em portugues brasileiro.',
    'O texto deve soar como erudicao fantastica medieval, com excesso de historia, natureza ou filosofia.',
    'Nao mencione que voce e uma IA. Nao use markdown. Nao use lista. Nao use aspas externas.',
    'Evite ofensas diretas, palavroes e ataques a grupos protegidos.',
    'Tamanho: entre 90 e 150 palavras.',
    `Tema preferencial: ${theme}.`,
  ].join('\n');
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function generateLeroLero(category) {
  const ollamaResponse = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: buildPrompt(category),
      stream: false,
      options: {
        temperature: 0.9,
        top_p: 0.92,
        num_predict: 220,
      },
    }),
  });

  if (!ollamaResponse.ok) {
    const message = await ollamaResponse.text();
    throw new Error(`Ollama respondeu ${ollamaResponse.status}: ${message}`);
  }

  const payload = await ollamaResponse.json();
  const text = String(payload.response ?? '').trim();

  if (!text) {
    throw new Error('Ollama retornou uma resposta vazia.');
  }

  return text;
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      model: OLLAMA_MODEL,
      ollamaHost: OLLAMA_HOST,
    });
    return;
  }

  if (request.method === 'POST' && request.url === '/api/lero-lero') {
    try {
      const body = await readJsonBody(request);
      const category = typeof body.category === 'string' ? body.category : 'genealogy';
      const text = await generateLeroLero(category);

      sendJson(response, 200, {
        text,
        model: OLLAMA_MODEL,
      });
    } catch (error) {
      sendJson(response, 502, {
        error: error instanceof Error ? error.message : 'Falha ao gerar texto com o Ollama.',
      });
    }

    return;
  }

  sendJson(response, 404, { error: 'Rota nao encontrada.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API local em http://127.0.0.1:${PORT}`);
  console.log(`Ollama em ${OLLAMA_HOST} usando modelo ${OLLAMA_MODEL}`);
});
