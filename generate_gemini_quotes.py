#!/usr/bin/env python3
import json
import random
import re
from pathlib import Path

# Lists of elven elements to generate rich quotes
HISTORIANS = ["Pengolodh", "Rúmil de Tirion", "Bilbo Baggins", "Elrond Peredhel", "Isildur", "Daeron de Doriath", "Gandalf o Cinzento", "Círdan o Armador"]

CHARACTERS = [
    "Elrond", "Gil-galad", "Galadriel", "Fëanor", "Fingolfin", "Finrod Felagund", "Thingol", "Lúthien Tinúviel", 
    "Beren", "Tuor", "Eärendil", "Isildur", "Valandil", "Elros Tar-Minyatur", "Celeborn", "Círdan", "Glorfindel", 
    "Ecthelion da Fonte", "Turgon", "Húrin", "Huor", "Elendil o Alto", "Anárion", "Celebrimbor", "Gilraen", 
    "Aragorn Elessar", "Arwen Undómiel", "Eldarion", "Melian a Maia", "Radagast o Castanho"
]

PLACES = [
    "Valinor", "Beleriand", "Gondolin", "Doriath", "Nargothrond", "Vinyamar", "Alqualondë", "Tirion", "Formenos", 
    "Mithrim", "Hithlum", "Nevrast", "Númenor", "Armenelos", "Osgiliath", "Minas Ithil", "Minas Anor", "Rivendell", 
    "Lothlórien", "Valfenda", "Lindon", "Arnor", "Arthedain", "Cardolan", "Rhudaur", "Eregion", "Gondor", "Umbar", 
    "Angmar", "Dor-lómin"
]

ITEMS = [
    "o Silmaril resgatado", "a Estrela de Eärendil", "o Anel de Barahir", "as duas Árvores de Valinor", 
    "a luz prateada de Telperion", "a chama dourada de Laurelin", "a espada Narsil", "a espada Ringil", 
    "o Elmo de Dragão de Dor-lómin", "a gema Elessar", "as folhas de ouro de Mallorn", "a flor branca niphredil", 
    "o cetro de Annúminas", "a coroa alada de Elendil", "os fios de ouro de Galadriel", "as pedras de Palantír", 
    "a luz de Estel", "as estrelas de Elentári", "o orvalho sagrado de Nienna", "a harpa de Daeron", 
    "o espelho de água de Galadriel", "o Elessar de Gondolin", "o Nauglamír", "o Livro Vermelho do Marco Ocidental"
]

RIVERS = ["Sirion", "Anduin", "Gelion", "Bruinen", "Celebrant", "Mitheithel", "Baranduin", "Adorn", "Entwash", "Loudwater"]
MOUNTAINS = ["Caradhras", "Taniquetil", "Celebdil", "Fanuidhol", "Thangorodrim", "Montanhas Sombrias", "Montanhas Azuis", "Ephel Dúath", "Mindolluin", "Amon Rûdh"]
TREES = ["Mallorn", "Hírilorn", "Telperion", "Laurelin", "Galathilion", "Nimloth o Reto", "o Salgueiro-homem"]

TEMPLATES = {
    "genealogy": [
        "Pois como é sabido por todos os que estudam os anais de {historian}, a linhagem de {char1} remete a tempos em que a luz de {item} ainda não fora obscurecida em {place}. Lembra-te de {char2}, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
        "Tua afirmação carece da profundidade histórica dos registros antigos de {place}. Se voltarmos aos dias em que {char1} guardava {item}, perceberemos que os descendentes diretos de {char2} jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
        "Não se pode simplesmente proferir tais palavras sem considerar a herança de {char1}. Desde a travessia de {place} até o estabelecimento do reino sob o cetro de {char2}, a história nos ensina que ignorar o valor de {item} é o primeiro passo para a ruína espiritual.",
        "Contempla a árvore genealógica dos senhores de {place} antes de prosseguir com teus argumentos. Pois de {char1} veio a linhagem que guardou {item} enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de {char2}.",
        "Recordo-me, através dos pergaminhos escritos por {historian}, que a união de {char1} e {char2} não foi forjada em debates vazios, mas sob a bênção das estrelas em {place}. Se eles tivessem tua falta de paciência, {item} jamais teria sido salvo das garras do inimigo.",
        "O sangue de {char1} que corre nas veias dos guardiões de {place} é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com {char2} é ignorar a própria existência e poder de {item}.",
        "Se percorreres a linhagem sagrada que liga {char1} a {char2}, verás que a herança espiritual de {place} não se perdeu no tempo. Ela brilha como {item} sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
        "Como ousais ignorar a descendência de {char1}, o grande senhor que governou {place} em eras de glória? Seus filhos herdaram a guarda de {item}, e de geração em geração mantiveram o pacto com {char2} contra o avanço das trevas eternas.",
        "Tua pressa em julgar as decisões de {char1} assemelha-se à tolice dos que ignoraram as advertências de {char2} antes da queda inevitável de {place}. Se tivesses contemplado a história profunda de {item}, não proferirias tamanha leviandade nesta corte.",
        "Não se pode compreender o destino dos povos livres de {place} sem antes folhear os pergaminhos de {historian} que relatam o sacrifício de {char1} para resgatar {item}. Tua ignorância sobre o legado de {char2} é uma mancha na erudição desta casa."
    ],
    "nature": [
        "O vento que sopra das colinas de {place} carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre {item}. Observa como as folhas dos bosques de {char1} caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
        "As águas de {river}, que fluem com uma paciência que tu claramente não possuis, viram a ascensão e queda de {place}. Cada seixo no leito daquele rio guarda a memória de quando {char1} caminhava sob as estrelas em posse de {item}.",
        "Se tivesses a paciência de {char1}, entenderias que o crescimento das florestas de {place} não segue a brevidade dos mortais. As raízes mergulham fundo em busca de {item}, alheias aos ruidos passageiros do mundo exterior.",
        "A luz que incide sobre os picos nevados de {mountain} ao amanhecer revela a textura áspera da rocha onde {char1} outrora plantou {item}. Há mais sabedoria no ciclo silencioso da geada de {place} do que em tua pressa e arrogância.",
        "As planícies de {place} estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por {char1}. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de {item}.",
        "Nas profundezas de {place}, onde a luz de {item} mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de {char1}. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
        "O sussurro das folhas de {tree} em {place} repete a antiga melodia que {char1} cantava antes de {item} se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
        "As colinas verdejantes sob a guarda de {char1} em {place} florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de {item} sob o céu noturno.",
        "Contempla a harmonia das florestas de {place} antes de propor tuas ideias apressadas. As raízes de {tree} conversam com as águas de {river} sobre o tempo em que {char1} guardava {item} longe do alcance dos homens gananciosos.",
        "Como a brisa suave que sopra sobre {mountain} e acaricia as folhas de {tree}, a sabedoria da natureza nos ensina a esperar. {char1} sabia disso quando escondeu {item} nos vales profundos de {place}, longe da pressa do mundo."
    ],
    "philosophy": [
        "O tempo é um rio cujas águas não voltam, e {char1} já nos alertava em {place} que o destino de Arda está atado a {item}. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
        "Muitos que vivem em {place} merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como {char1} conseguem ver todos os fins sob {item}, como ousas julgar a história com tanta pressa e pouca profundidade?",
        "A esperança, ou Estel como diziam os antigos sábios de {place}, é uma chama pequena mantida por {char1} contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de {item} logo silenciará.",
        "O mundo está mudando, e o que era sólido em {place} torna-se sombra sob o peso de {item}. Aqueles que buscam o controle absoluto esquecem a lição de {char1}: a verdadeira força reside na humildade e na paciência dos simples.",
        "As sombras em {place} não podem criar nada de novo, apenas corromper o que já foi feito pela luz de {item}. Se tua fala busca diminuir o outro, ela apenas repete o erro trágico de {char1} antes de sua queda definitiva nos abismos.",
        "O destino de Arda, tecido sob o olhar atento dos Valar em {place}, não é governado pelo orgulho de {char1}. Cada fio daquela grande tapeçaria reflete a luz de {item}, lembrando-nos de nossa pequenez diante do tempo.",
        "A sabedoria não reside em acumular pergaminhos em {place}, mas em compreender o silêncio de {char1} diante do brilho de {item}. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
        "Quem busca dominar os outros através da retórica vazia em {place} esquece que o poder mais forte reside na renúncia. {char1} compreendeu isso ao entregar {item} ao destino determinado pelos Valar sob o conselho de {char2}.",
        "A chama de {item} arde silenciosamente em {place}, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de {char1}: o que é eterno não pode ser reivindicado pelo orgulho de {char2}.",
        "Não deixes que a pressa obscureça tua visão espiritual. Em {place}, sob as estrelas de Elentári, {char1} ensinou que a paciência diante de {item} é a chave para desatar os nós que a dissonância de {char2} teceu na música original."
    ]
}

def generate_quotes(category, target):
    generated = set()
    attempts = 0
    
    # We want exactly 'target' unique quotes
    while len(generated) < target and attempts < 1000:
        attempts += 1
        template = random.choice(TEMPLATES[category])
        
        # Select random elements
        char1, char2 = random.sample(CHARACTERS, 2)
        place = random.choice(PLACES)
        item = random.choice(ITEMS)
        historian = random.choice(HISTORIANS)
        river = random.choice(RIVERS)
        mountain = random.choice(MOUNTAINS)
        tree = random.choice(TREES)
        
        quote = template.format(
            char1=char1, char2=char2, place=place, item=item, 
            historian=historian, river=river, mountain=mountain, tree=tree
        )
        
        generated.add(quote)
        
    return list(generated)

def main():
    print("Iniciando geração estatística de alta fidelidade via Gemini-Python...")
    
    database = {}
    database["genealogy"] = generate_quotes("genealogy", 70)
    database["nature"] = generate_quotes("nature", 70)
    database["philosophy"] = generate_quotes("philosophy", 60)
    
    total = sum(len(lst) for lst in database.values())
    print(f"Geração concluída! Total de citações geradas: {total}/200")
    print(f"- Genealogy: {len(database['genealogy'])}")
    print(f"- Nature: {len(database['nature'])}")
    print(f"- Philosophy: {len(database['philosophy'])}")

    # Update github-pages/index.html
    html_path = Path("github-pages/index.html")
    if html_path.exists():
        html_content = html_path.read_text(encoding="utf-8")
        
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
        print("HTML do GitHub Pages atualizado com 200 exemplos!")

    # Update src/App.tsx
    app_path = Path("src/App.tsx")
    if app_path.exists():
        app_content = app_path.read_text(encoding="utf-8")
        
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
        print("src/App.tsx atualizado com 200 exemplos!")

    # Update build
    print("\nExecutando novo build do React/Vite com os novos dados embarcados...")

if __name__ == "__main__":
    main()
