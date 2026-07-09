# Valfenda MCP Router Server

Um servidor compatível com a especificação **Model Context Protocol (MCP)** para rotear e gerenciar consultas de IA entre o **Gemini (Nuvem)** e o **Ollama (Local)**.

## 🛠️ Ferramentas Disponibilizadas

O servidor expõe as seguintes ferramentas aos clientes compatíveis com MCP:
1. `check_status`: Verifica se o Ollama local está rodando, lista os modelos disponíveis e checa se a chave do Gemini está configurada.
2. `generate_local`: Envia uma requisição direta para o Ollama local.
3. `generate_cloud`: Envia uma requisição direta para a API do Gemini.
4. `route_query`: Roteia de forma inteligente com base na complexidade do prompt. Se for simples, processa localmente (Ollama); se for complexo, envia para a nuvem (Gemini).

---

## ⚡ Recomendação de Modelos para GPU GTX 1650 (4GB VRAM)

Placas de vídeo de entrada como a **NVIDIA GTX 1650** possuem **4 GB de VRAM**. Para que a geração local do Ollama seja rápida, o modelo precisa caber **inteiramente na VRAM**. Se o modelo for maior que a memória da placa de vídeo, partes dele serão processadas na CPU, deixando a geração extremamente lenta.

Os modelos ideais recomendados para esse setup são:

| Modelo | Tamanho dos Parâmetros | Uso estimado de VRAM | Por que usar? |
| :--- | :--- | :--- | :--- |
| **`qwen2.5:3b`** *(Recomendado)* | ~3 Bilhões | ~2.2 GB | Excelente suporte para o idioma português brasileiro, ideal para geração de texto geral. |
| **`llama3.2:3b`** | ~3 Bilhões | ~2.2 GB | Ótimo modelo geral da Meta, muito rápido e com excelente compreensão estrutural. |
| **`gemma2:2b`** | ~2 Bilhões | ~1.6 GB | Criado pelo Google, tem excelente raciocínio lógico e cabe com folga nos 4GB. |
| **`qwen2.5:1.5b`** | ~1.5 Bilhão | ~1.1 GB | Ultra-rápido, ideal se você tiver navegadores e jogos abertos ao mesmo tempo consumindo VRAM. |

---

## ⚙️ Como configurar em seu cliente MCP (VSCode, Claude Desktop, Cursor)

Adicione a seguinte configuração no arquivo de configurações de MCP do seu cliente:

### Exemplo de Configuração (`claude_desktop_config.json` ou `mcp_config.json`)

```json
{
  "mcpServers": {
    "valfenda-router": {
      "command": "node",
      "args": [
        "/mnt/c/Users/lcwey/projetos_pessoais/lero-lero-valfenda/mcp-server/index.mjs"
      ],
      "env": {
        "OLLAMA_HOST": "http://127.0.0.1:11434",
        "OLLAMA_MODEL": "qwen2.5:3b",
        "GEMINI_API_KEY": "SUA_API_KEY_AQUI"
      }
    }
  }
}
```

> [!NOTE]
> Para obter uma chave de API do Gemini grátis, acesse o [Google AI Studio](https://aistudio.google.com/).
