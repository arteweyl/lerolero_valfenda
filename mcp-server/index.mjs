#!/usr/bin/env node

/**
 * Valfenda MCP Router Server
 * Exposes tools to route prompts between Gemini (Cloud) and Ollama (Local).
 * Dependency-free JSON-RPC 2.0 stdio server.
 */

import { createInterface } from 'node:readline';

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:3b'; // Ideal for GTX 1650 (4GB VRAM)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const GEMINI_MODEL = 'gemini-2.5-flash';

// Helper to write JSON-RPC messages to stdout
function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({
    jsonrpc: '2.0',
    id,
    result
  }) + '\n');
}

function sendError(id, code, message, data = null) {
  process.stdout.write(JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: { code, message, data }
  }) + '\n');
}

// Log debugging info to stderr, since stdout is reserved for JSON-RPC
function log(msg) {
  process.stderr.write(`[valfenda-mcp] ${msg}\n`);
}

// --- Tool Implementations ---

async function checkStatus() {
  let ollamaRunning = false;
  let ollamaModels = [];
  let geminiReady = !!GEMINI_API_KEY;

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (res.ok) {
      ollamaRunning = true;
      const data = await res.json();
      ollamaModels = data.models?.map(m => m.name) ?? [];
    }
  } catch {
    ollamaRunning = false;
  }

  return {
    local: {
      ollamaHost: OLLAMA_HOST,
      ollamaRunning,
      defaultModel: OLLAMA_MODEL,
      availableModels: ollamaModels,
      gtx1650Recommendation: "Para GPU GTX 1650 (4GB VRAM), recomendamos usar 'qwen2.5:3b' ou 'llama3.2:3b' que rodam 100% na VRAM para velocidade máxima."
    },
    cloud: {
      geminiModel: GEMINI_MODEL,
      apiConfigured: geminiReady
    }
  };
}

async function callOllama(prompt, model = OLLAMA_MODEL) {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.7 }
      })
    });

    if (!res.ok) {
      throw new Error(`Ollama respondeu com status ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.response ?? '',
      model: data.model ?? model,
      source: 'local_ollama'
    };
  } catch (err) {
    throw new Error(`Falha ao conectar com o Ollama local: ${err.message}`);
  }
}

async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Variável de ambiente GEMINI_API_KEY não foi configurada.");
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message ?? `Erro na API do Gemini: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return {
      text,
      model: GEMINI_MODEL,
      source: 'cloud_gemini'
    };
  } catch (err) {
    throw new Error(`Falha na API do Gemini: ${err.message}`);
  }
}

async function routeQuery(prompt, force = null) {
  if (force === 'local') {
    return await callOllama(prompt);
  }
  if (force === 'cloud') {
    return await callGemini(prompt);
  }

  // Smart routing logic
  // 1. If Gemini key is missing, default to local Ollama
  if (!GEMINI_API_KEY) {
    log("GEMINI_API_KEY ausente, roteando para Ollama local.");
    return await callOllama(prompt);
  }

  // 2. Simple classification based on length/keywords
  const promptLower = prompt.toLowerCase();
  const isComplex = 
    prompt.length > 500 || 
    promptLower.includes('refator') || 
    promptLower.includes('explique') || 
    promptLower.includes('debug') || 
    promptLower.includes('escreva um código') ||
    promptLower.includes('arquitetura');

  if (isComplex) {
    log("Prompt classificado como complexo. Roteando para Gemini Cloud.");
    try {
      return await callGemini(prompt);
    } catch (err) {
      log(`Falha no Gemini: ${err.message}. Fazendo fallback para Ollama local.`);
      return await callOllama(prompt);
    }
  } else {
    log("Prompt classificado como simples. Roteando para Ollama Local.");
    try {
      return await callOllama(prompt);
    } catch (err) {
      log(`Falha no Ollama: ${err.message}. Fazendo fallback para Gemini Cloud.`);
      return await callGemini(prompt);
    }
  }
}

// --- STDIO JSON-RPC Handler ---

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    sendError(null, -32700, "Parse error");
    return;
  }

  const { method, params, id } = request;

  if (method === 'initialize') {
    sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'valfenda-mcp-router',
        version: '1.0.0'
      }
    });
    return;
  }

  if (method === 'notifications/initialized') {
    // Client acknowledgment, no response required
    return;
  }

  if (method === 'tools/list') {
    sendResponse(id, {
      tools: [
        {
          name: 'check_status',
          description: 'Verifica o status de conexão com o Ollama local e a API Cloud do Gemini, retornando recomendações de hardware.',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'generate_local',
          description: 'Gera resposta usando o Ollama local (ideal para uso offline e privacidade).',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: { type: 'string', description: 'O texto de prompt a enviar para a IA' },
              model: { type: 'string', description: 'Opcional. Modelo do Ollama a usar. O padrão é qwen2.5:3b' }
            },
            required: ['prompt']
          }
        },
        {
          name: 'generate_cloud',
          description: 'Gera resposta usando o Gemini-2.5-Flash na nuvem (ideal para tarefas complexas, código ou raciocínio).',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: { type: 'string', description: 'O texto de prompt a enviar para o Gemini' }
            },
            required: ['prompt']
          }
        },
        {
          name: 'route_query',
          description: 'Roteia inteligentemente o prompt entre Gemini (tarefas complexas) e Ollama (tarefas simples ou offline).',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: { type: 'string', description: 'O prompt a ser roteado e processado' },
              force: { type: 'string', enum: ['local', 'cloud'], description: 'Opcional. Força a rota para local ou cloud.' }
            },
            required: ['prompt']
          }
        }
      ]
    });
    return;
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;

    try {
      let result;
      if (name === 'check_status') {
        result = await checkStatus();
      } else if (name === 'generate_local') {
        result = await callOllama(args.prompt, args.model);
      } else if (name === 'generate_cloud') {
        result = await callGemini(args.prompt);
      } else if (name === 'route_query') {
        result = await routeQuery(args.prompt, args.force);
      } else {
        sendError(id, -32601, `Tool not found: ${name}`);
        return;
      }

      sendResponse(id, {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }
        ]
      });
    } catch (err) {
      sendResponse(id, {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Erro ao executar a ferramenta: ${err.message}`
          }
        ]
      });
    }
    return;
  }

  // Method not found handler for other MCP lifecycle methods
  if (id !== undefined) {
    sendError(id, -32601, `Method not found: ${method}`);
  }
});
