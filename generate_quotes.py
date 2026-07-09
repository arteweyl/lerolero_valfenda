#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import re
import sys
from pathlib import Path

OLLAMA_HOST = "http://127.0.0.1:11434"
OLLAMA_MODEL = "qwen2.5:3b"

CATEGORIES = {
    "genealogy": {
        "theme": "genealogia, linhagens antigas, reis esquecidos, pergaminhos e árvores familiares impossíveis",
        "target": 70
    },
    "nature": {
        "theme": "natureza, florestas, rios, montanhas, ervas, estações e observação paciente do mundo",
        "target": 70
    },
    "philosophy": {
        "theme": "filosofia, destino, tempo, humildade, poder, esperança e julgamento precipitado",
        "target": 60
    }
}

def generate_batch(category, theme, count):
    prompt = (
        f"Você é um gerador de 'reprimendas de Valfenda'.\n"
        f"Gere exatamente {count} reprimendas longas, pomposas, medievais e excessivamente eruditas em português brasileiro sobre o tema: {theme}.\n"
        f"Cada texto deve ter entre 80 e 150 palavras e usar vocabulário rebuscado do universo fantástico medieval (mencione nomes de Elfos, Valar, locais como Beleriand, Gondolin, Númenor, Lothlórien, etc.).\n"
        f"Retorne o resultado estritamente no seguinte formato numerado:\n"
        f"1. [Texto 1]\n"
        f"2. [Texto 2]\n"
        f"Não inclua nenhuma outra palavra de introdução ou conclusão. Retorne apenas a lista numerada."
    )

    data = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.85,
            "top_p": 0.9,
            "num_predict": 2000
        }
    }

    req = urllib.request.Request(
        f"{OLLAMA_HOST}/api/generate",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data.get("response", "").strip()
            
            valid_items = []
            # Split lines and extract numbered items
            for line in text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                match = re.match(r'^\d+[\.\)\-]\s*(.+)$', line)
                if match:
                    quote = match.group(1).strip()
                    # Strip outer quotes if the model added them
                    quote = re.sub(r'^["\'«“\s]*(.*?)["\'»”\s]*$', r'\1', quote)
                    # Simple validation: must have at least 30 words
                    if len(quote.split()) >= 30:
                        valid_items.append(quote)
            return valid_items
    except Exception as e:
        print(f"Erro ao gerar lote: {e}")
        return []

def main():
    print("Iniciando geração automática de reprimendas de Valfenda...")
    
    # Verify Ollama running
    try:
        urllib.request.urlopen(f"{OLLAMA_HOST}/api/tags")
    except Exception:
        print(f"Erro: O Ollama não parece estar rodando em {OLLAMA_HOST}")
        sys.exit(1)

    database = {cat: [] for cat in CATEGORIES}
    total_target = sum(cfg["target"] for cfg in CATEGORIES.values())

    for category, config in CATEGORIES.items():
        target = config["target"]
        theme = config["theme"]
        print(f"\nCategoria '{category}': gerando {target} itens...")
        
        attempts = 0
        while len(database[category]) < target and attempts < 25:
            attempts += 1
            needed = target - len(database[category])
            batch_size = min(5, needed) # Batch size of 5 is highly reliable
            print(f"  Gerando lote de {batch_size} itens (Tentativa {attempts})...")
            
            items = generate_batch(category, theme, batch_size)
            if items:
                new_items = []
                for item in items:
                    if item not in database[category] and item not in new_items:
                        new_items.append(item)
                
                database[category].extend(new_items)
                
                # Print progress status
                current_total = sum(len(lst) for lst in database.values())
                print(f"  Adicionados {len(new_items)} itens. Categoria: {len(database[category])}/{target} | Total Geral: {current_total}/{total_target}")
            else:
                print("  Lote vazio ou inválido, tentando novamente...")

    print("\nGeração concluída! Resultados obtidos:")
    for cat, items in database.items():
        print(f"- {cat}: {len(items)} itens")

    # Save to a temporary JSON file for backup
    backup_path = Path("github-pages/quotes_backup.json")
    backup_path.parent.mkdir(exist_ok=True)
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump(database, f, ensure_ascii=False, indent=2)
    print(f"Backup salvo em: {backup_path}")

    # 1. Update github-pages/index.html
    html_path = Path("github-pages/index.html")
    if html_path.exists():
        html_content = html_path.read_text(encoding="utf-8")
        
        # Format the database dictionary for JS
        formatted_db = "const DATABASE = {\n"
        for cat in ["genealogy", "nature", "philosophy"]:
            formatted_db += f"      {cat}: [\n"
            for item in database[cat]:
                escaped_item = item.replace('\\', '\\\\').replace('"', '\\"')
                formatted_db += f'        "{escaped_item}",\n'
            formatted_db += "      ],\n"
        formatted_db += "    };"
        
        pattern = r"const DATABASE\s*=\s*\{.*?\}\s*;\s*\n\s*const CATEGORY_THEMES"
        new_content = re.sub(pattern, f"{formatted_db}\n\n    const CATEGORY_THEMES", html_content, flags=re.DOTALL)
        
        html_path.write_text(new_content, encoding="utf-8")
        print("HTML do GitHub Pages atualizado com sucesso!")

    # 2. Update src/App.tsx
    app_path = Path("src/App.tsx")
    if app_path.exists():
        app_content = app_path.read_text(encoding="utf-8")
        
        # Format the database dictionary for TSX
        formatted_db = "const DATABASE: Record<Category, string[]> = {\n"
        for cat in ["genealogy", "nature", "philosophy"]:
            formatted_db += f"  {cat}: [\n"
            for item in database[cat]:
                escaped_item = item.replace('\\', '\\\\').replace('"', '\\"')
                formatted_db += f'    "{escaped_item}",\n'
            formatted_db += "  ],\n"
        formatted_db += "};"
        
        pattern = r"const DATABASE: Record<Category, string\[\]> = \{.*?\};"
        new_content = re.sub(pattern, formatted_db, app_content, flags=re.DOTALL)
        
        app_path.write_text(new_content, encoding="utf-8")
        print("src/App.tsx atualizado com sucesso!")

if __name__ == "__main__":
    main()
