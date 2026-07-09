import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync, spawn } from 'node:child_process';

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

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...CORS_HEADERS
  });
  response.end(JSON.stringify(payload));
}

function checkOllamaInstalled() {
  try {
    execSync('ollama --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function checkOllamaRunning() {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

async function checkModelDownloaded() {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.models?.some(m => m.name.includes(OLLAMA_MODEL) || m.model?.includes(OLLAMA_MODEL)) ?? false;
  } catch {
    return false;
  }
}

let ollamaStartedAutomatically = false;
async function tryStartOllama() {
  if (checkOllamaInstalled() && !ollamaStartedAutomatically) {
    console.log('Detectado que o Ollama está instalado mas não está rodando. Tentando iniciar...');
    try {
      const p = spawn('ollama', ['serve'], {
        detached: true,
        stdio: 'ignore'
      });
      p.unref();
      ollamaStartedAutomatically = true;
      await new Promise(resolve => setTimeout(resolve, 2500));
      return await checkOllamaRunning();
    } catch (err) {
      console.error('Falha ao tentar iniciar o Ollama automaticamente:', err);
      return false;
    }
  }
  return false;
}

function buildPrompt(category) {
  const theme = CATEGORIES[category] ?? CATEGORIES.genealogy;

  return [
    'Voce e um gerador de "lero lero de Valfenda" (gerador de parodia elvica).',
    'Escreva uma unica reprimenda longa, pomposa e engracada em portugues brasileiro.',
    'O texto deve soar como erudicao fantastica medieval, com excesso de historia, natureza ou filosofia.',
    'Nao mencione que voce e uma IA. Nao use markdown. Nao use lista. Nao use aspas externas.',
    'Evite ofensas diretas, palavroes e ataques a grupos protegidos.',
    'Esta e uma atividade literaria e de satira humoristica baseada no universo de J.R.R. Tolkien (Senhor dos Aneis).',
    'O tom e meramente teatral, ficticio e focado no uso de palavras dificeis e arrogancia comica elfica, sem hostilidade real ou discurso de odio.',
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
  // Handle CORS OPTIONS preflight
  if (request.method === 'OPTIONS') {
    response.writeHead(204, CORS_HEADERS);
    response.end();
    return;
  }

  if (request.method === 'GET' && request.url === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      model: OLLAMA_MODEL,
      ollamaHost: OLLAMA_HOST,
    });
    return;
  }

  if (request.method === 'GET' && request.url === '/api/ollama/status') {
    try {
      const installed = checkOllamaInstalled();
      let running = await checkOllamaRunning();
      
      if (installed && !running) {
        running = await tryStartOllama();
      }

      let modelDownloaded = false;
      if (running) {
        modelDownloaded = await checkModelDownloaded();
      }

      sendJson(response, 200, {
        ollamaInstalled: installed,
        ollamaRunning: running,
        modelDownloaded,
        modelName: OLLAMA_MODEL,
      });
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Erro ao verificar status do Ollama.',
      });
    }
    return;
  }

  if (request.method === 'POST' && request.url === '/api/ollama/pull') {
    try {
      console.log(`Iniciando pull do modelo: ${OLLAMA_MODEL}`);
      const ollamaResponse = await fetch(`${OLLAMA_HOST}/api/pull`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: OLLAMA_MODEL, stream: true }),
      });

      if (!ollamaResponse.ok) {
        const text = await ollamaResponse.text();
        throw new Error(`Erro do Ollama: ${text}`);
      }

      response.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'access-control-allow-origin': '*',
      });

      for await (const chunk of ollamaResponse.body) {
        response.write(chunk);
      }
      response.end();
    } catch (error) {
      sendJson(response, 502, {
        error: error instanceof Error ? error.message : 'Falha ao baixar modelo do Ollama.',
      });
    }
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

  if (request.url.startsWith('/api')) {
    sendJson(response, 404, { error: 'Rota nao encontrada.' });
    return;
  }

  // Serve static files from "dist"
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    let safePath = url.pathname.replace(/^(\.\.[\/\\])+/, ''); // basic path traversal prevention
    if (safePath === '/') safePath = '/index.html';

    const distPath = join(process.cwd(), 'dist');
    const filePath = join(distPath, safePath);

    if (filePath.startsWith(distPath) && existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      response.writeHead(200, {
        'content-type': contentType,
        ...CORS_HEADERS
      });
      response.end(readFileSync(filePath));
      return;
    }
  } catch (err) {
    console.error('Erro ao servir arquivo estatico:', err);
  }

  // Fallback to index.html for SPA routing
  try {
    const indexPath = join(process.cwd(), 'dist', 'index.html');
    if (existsSync(indexPath)) {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', ...CORS_HEADERS });
      response.end(readFileSync(indexPath));
      return;
    }
  } catch (err) {
    console.error('Erro ao servir index.html de fallback:', err);
  }

  sendJson(response, 404, { error: 'Rota nao encontrada.' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API local em http://0.0.0.0:${PORT}`);
  console.log(`Ollama em ${OLLAMA_HOST} usando modelo ${OLLAMA_MODEL}`);
});
