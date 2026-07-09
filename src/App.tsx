import { useEffect, useMemo, useState } from 'react';
import { Copy, History, Quote, RefreshCw, Sparkles, TreePine } from 'lucide-react';

type Category = 'genealogy' | 'nature' | 'philosophy';

const CATEGORY_LABELS: Record<Category, string> = {
  genealogy: 'Genealogia',
  nature: 'Natureza',
  philosophy: 'Filosofia',
};

const DATABASE: Record<Category, string[]> = {
  genealogy: [
    "Contempla a árvore genealógica dos senhores de Númenor antes de prosseguir com teus argumentos. Pois de Celeborn veio a linhagem que guardou a espada Narsil enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Ecthelion da Fonte.",
    "O sangue de Gilraen que corre nas veias dos guardiões de Beleriand é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Elrond é ignorar a própria existência e poder de a gema Elessar.",
    "Não se pode compreender o destino dos povos livres de Tirion sem antes folhear os pergaminhos de Pengolodh que relatam o sacrifício de Elendil o Alto para resgatar a gema Elessar. Tua ignorância sobre o legado de Fingolfin é uma mancha na erudição desta casa.",
    "Contempla a árvore genealógica dos senhores de Númenor antes de prosseguir com teus argumentos. Pois de Finrod Felagund veio a linhagem que guardou a espada Ringil enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Eldarion.",
    "Como ousais ignorar a descendência de Beren, o grande senhor que governou Gondor em eras de glória? Seus filhos herdaram a guarda de o Anel de Barahir, e de geração em geração mantiveram o pacto com Radagast o Castanho contra o avanço das trevas eternas.",
    "Tua afirmação carece da profundidade histórica dos registros antigos de Umbar. Se voltarmos aos dias em que Melian a Maia guardava o Anel de Barahir, perceberemos que os descendentes diretos de Elros Tar-Minyatur jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
    "Pois como é sabido por todos os que estudam os anais de Isildur, a linhagem de Gil-galad remete a tempos em que a luz de o Silmaril resgatado ainda não fora obscurecida em Mithrim. Lembra-te de Galadriel, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Como ousais ignorar a descendência de Tuor, o grande senhor que governou Arnor em eras de glória? Seus filhos herdaram a guarda de a flor branca niphredil, e de geração em geração mantiveram o pacto com Galadriel contra o avanço das trevas eternas.",
    "O sangue de Celeborn que corre nas veias dos guardiões de Vinyamar é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Anárion é ignorar a própria existência e poder de o cetro de Annúminas.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Glorfindel. Desde a travessia de Gondolin até o estabelecimento do reino sob o cetro de Círdan, a história nos ensina que ignorar o valor de a flor branca niphredil é o primeiro passo para a ruína espiritual.",
    "O sangue de Turgon que corre nas veias dos guardiões de Angmar é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Eärendil é ignorar a própria existência e poder de o Elessar de Gondolin.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Celebrimbor. Desde a travessia de Armenelos até o estabelecimento do reino sob o cetro de Círdan, a história nos ensina que ignorar o valor de as pedras de Palantír é o primeiro passo para a ruína espiritual.",
    "Como ousais ignorar a descendência de Aragorn Elessar, o grande senhor que governou Vinyamar em eras de glória? Seus filhos herdaram a guarda de o Anel de Barahir, e de geração em geração mantiveram o pacto com Húrin contra o avanço das trevas eternas.",
    "Contempla a árvore genealógica dos senhores de Númenor antes de prosseguir com teus argumentos. Pois de Anárion veio a linhagem que guardou o Anel de Barahir enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Celeborn.",
    "Contempla a árvore genealógica dos senhores de Rhudaur antes de prosseguir com teus argumentos. Pois de Thingol veio a linhagem que guardou a flor branca niphredil enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Beren.",
    "Contempla a árvore genealógica dos senhores de Angmar antes de prosseguir com teus argumentos. Pois de Tuor veio a linhagem que guardou o orvalho sagrado de Nienna enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Arwen Undómiel.",
    "Não se pode compreender o destino dos povos livres de Armenelos sem antes folhear os pergaminhos de Pengolodh que relatam o sacrifício de Fingolfin para resgatar o Livro Vermelho do Marco Ocidental. Tua ignorância sobre o legado de Gilraen é uma mancha na erudição desta casa.",
    "Não se pode compreender o destino dos povos livres de Lindon sem antes folhear os pergaminhos de Círdan o Armador que relatam o sacrifício de Círdan para resgatar o Anel de Barahir. Tua ignorância sobre o legado de Finrod Felagund é uma mancha na erudição desta casa.",
    "Se percorreres a linhagem sagrada que liga Elendil o Alto a Elros Tar-Minyatur, verás que a herança espiritual de Valinor não se perdeu no tempo. Ela brilha como a flor branca niphredil sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Recordo-me, através dos pergaminhos escritos por Gandalf o Cinzento, que a união de Húrin e Glorfindel não foi forjada em debates vazios, mas sob a bênção das estrelas em Númenor. Se eles tivessem tua falta de paciência, a harpa de Daeron jamais teria sido salvo das garras do inimigo.",
    "Como ousais ignorar a descendência de Tuor, o grande senhor que governou Eregion em eras de glória? Seus filhos herdaram a guarda de o orvalho sagrado de Nienna, e de geração em geração mantiveram o pacto com Fingolfin contra o avanço das trevas eternas.",
    "Pois como é sabido por todos os que estudam os anais de Pengolodh, a linhagem de Glorfindel remete a tempos em que a luz de as estrelas de Elentári ainda não fora obscurecida em Armenelos. Lembra-te de Beren, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Contempla a árvore genealógica dos senhores de Dor-lómin antes de prosseguir com teus argumentos. Pois de Fëanor veio a linhagem que guardou o cetro de Annúminas enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Gil-galad.",
    "O sangue de Elrond que corre nas veias dos guardiões de Arnor é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Ecthelion da Fonte é ignorar a própria existência e poder de a luz prateada de Telperion.",
    "Recordo-me, através dos pergaminhos escritos por Pengolodh, que a união de Isildur e Fingolfin não foi forjada em debates vazios, mas sob a bênção das estrelas em Formenos. Se eles tivessem tua falta de paciência, a espada Narsil jamais teria sido salvo das garras do inimigo.",
    "Se percorreres a linhagem sagrada que liga Radagast o Castanho a Thingol, verás que a herança espiritual de Cardolan não se perdeu no tempo. Ela brilha como a espada Ringil sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Contempla a árvore genealógica dos senhores de Umbar antes de prosseguir com teus argumentos. Pois de Ecthelion da Fonte veio a linhagem que guardou o Livro Vermelho do Marco Ocidental enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Aragorn Elessar.",
    "Como ousais ignorar a descendência de Isildur, o grande senhor que governou Mithrim em eras de glória? Seus filhos herdaram a guarda de a gema Elessar, e de geração em geração mantiveram o pacto com Galadriel contra o avanço das trevas eternas.",
    "Como ousais ignorar a descendência de Radagast o Castanho, o grande senhor que governou Valinor em eras de glória? Seus filhos herdaram a guarda de o Anel de Barahir, e de geração em geração mantiveram o pacto com Tuor contra o avanço das trevas eternas.",
    "Tua pressa em julgar as decisões de Eldarion assemelha-se à tolice dos que ignoraram as advertências de Valandil antes da queda inevitável de Armenelos. Se tivesses contemplado a história profunda de o Silmaril resgatado, não proferirias tamanha leviandade nesta corte.",
    "Recordo-me, através dos pergaminhos escritos por Gandalf o Cinzento, que a união de Celebrimbor e Thingol não foi forjada em debates vazios, mas sob a bênção das estrelas em Arthedain. Se eles tivessem tua falta de paciência, o espelho de água de Galadriel jamais teria sido salvo das garras do inimigo.",
    "O sangue de Eldarion que corre nas veias dos guardiões de Cardolan é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Aragorn Elessar é ignorar a própria existência e poder de a gema Elessar.",
    "Se percorreres a linhagem sagrada que liga Elros Tar-Minyatur a Celeborn, verás que a herança espiritual de Angmar não se perdeu no tempo. Ela brilha como a luz prateada de Telperion sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Turgon. Desde a travessia de Nargothrond até o estabelecimento do reino sob o cetro de Gil-galad, a história nos ensina que ignorar o valor de o Livro Vermelho do Marco Ocidental é o primeiro passo para a ruína espiritual.",
    "Como ousais ignorar a descendência de Valandil, o grande senhor que governou Beleriand em eras de glória? Seus filhos herdaram a guarda de o cetro de Annúminas, e de geração em geração mantiveram o pacto com Gil-galad contra o avanço das trevas eternas.",
    "O sangue de Huor que corre nas veias dos guardiões de Nevrast é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Celebrimbor é ignorar a própria existência e poder de o orvalho sagrado de Nienna.",
    "O sangue de Valandil que corre nas veias dos guardiões de Nargothrond é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Gil-galad é ignorar a própria existência e poder de o Nauglamír.",
    "Pois como é sabido por todos os que estudam os anais de Daeron de Doriath, a linhagem de Arwen Undómiel remete a tempos em que a luz de a luz prateada de Telperion ainda não fora obscurecida em Rhudaur. Lembra-te de Eärendil, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Como ousais ignorar a descendência de Thingol, o grande senhor que governou Gondolin em eras de glória? Seus filhos herdaram a guarda de o Nauglamír, e de geração em geração mantiveram o pacto com Finrod Felagund contra o avanço das trevas eternas.",
    "O sangue de Finrod Felagund que corre nas veias dos guardiões de Lothlórien é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Húrin é ignorar a própria existência e poder de o Silmaril resgatado.",
    "Não se pode compreender o destino dos povos livres de Angmar sem antes folhear os pergaminhos de Gandalf o Cinzento que relatam o sacrifício de Gil-galad para resgatar a Estrela de Eärendil. Tua ignorância sobre o legado de Ecthelion da Fonte é uma mancha na erudição desta casa.",
    "Tua afirmação carece da profundidade histórica dos registros antigos de Lothlórien. Se voltarmos aos dias em que Huor guardava o Anel de Barahir, perceberemos que os descendentes diretos de Tuor jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
    "Contempla a árvore genealógica dos senhores de Armenelos antes de prosseguir com teus argumentos. Pois de Valandil veio a linhagem que guardou o orvalho sagrado de Nienna enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Elros Tar-Minyatur.",
    "Pois como é sabido por todos os que estudam os anais de Elrond Peredhel, a linhagem de Húrin remete a tempos em que a luz de a luz prateada de Telperion ainda não fora obscurecida em Rivendell. Lembra-te de Ecthelion da Fonte, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Como ousais ignorar a descendência de Eldarion, o grande senhor que governou Eregion em eras de glória? Seus filhos herdaram a guarda de as duas Árvores de Valinor, e de geração em geração mantiveram o pacto com Valandil contra o avanço das trevas eternas.",
    "Pois como é sabido por todos os que estudam os anais de Rúmil de Tirion, a linhagem de Círdan remete a tempos em que a luz de a gema Elessar ainda não fora obscurecida em Mithrim. Lembra-te de Húrin, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Pois como é sabido por todos os que estudam os anais de Isildur, a linhagem de Celeborn remete a tempos em que a luz de os fios de ouro de Galadriel ainda não fora obscurecida em Cardolan. Lembra-te de Fëanor, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Tuor. Desde a travessia de Lindon até o estabelecimento do reino sob o cetro de Ecthelion da Fonte, a história nos ensina que ignorar o valor de o Elmo de Dragão de Dor-lómin é o primeiro passo para a ruína espiritual.",
    "Não se pode compreender o destino dos povos livres de Beleriand sem antes folhear os pergaminhos de Gandalf o Cinzento que relatam o sacrifício de Eärendil para resgatar a harpa de Daeron. Tua ignorância sobre o legado de Gilraen é uma mancha na erudição desta casa.",
    "Se percorreres a linhagem sagrada que liga Fingolfin a Isildur, verás que a herança espiritual de Mithrim não se perdeu no tempo. Ela brilha como o cetro de Annúminas sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Beren. Desde a travessia de Hithlum até o estabelecimento do reino sob o cetro de Elendil o Alto, a história nos ensina que ignorar o valor de o Nauglamír é o primeiro passo para a ruína espiritual.",
    "Tua pressa em julgar as decisões de Gil-galad assemelha-se à tolice dos que ignoraram as advertências de Anárion antes da queda inevitável de Lindon. Se tivesses contemplado a história profunda de a harpa de Daeron, não proferirias tamanha leviandade nesta corte.",
    "Contempla a árvore genealógica dos senhores de Doriath antes de prosseguir com teus argumentos. Pois de Valandil veio a linhagem que guardou o espelho de água de Galadriel enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Galadriel.",
    "Não se pode compreender o destino dos povos livres de Tirion sem antes folhear os pergaminhos de Gandalf o Cinzento que relatam o sacrifício de Gilraen para resgatar a luz prateada de Telperion. Tua ignorância sobre o legado de Elros Tar-Minyatur é uma mancha na erudição desta casa.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Arwen Undómiel. Desde a travessia de Rhudaur até o estabelecimento do reino sob o cetro de Eärendil, a história nos ensina que ignorar o valor de as duas Árvores de Valinor é o primeiro passo para a ruína espiritual.",
    "O sangue de Fingolfin que corre nas veias dos guardiões de Lindon é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Elendil o Alto é ignorar a própria existência e poder de a gema Elessar.",
    "Tua afirmação carece da profundidade histórica dos registros antigos de Dor-lómin. Se voltarmos aos dias em que Finrod Felagund guardava as duas Árvores de Valinor, perceberemos que os descendentes diretos de Círdan jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
    "Não se pode simplesmente proferir tais palavras sem considerar a herança de Anárion. Desde a travessia de Rhudaur até o estabelecimento do reino sob o cetro de Elros Tar-Minyatur, a história nos ensina que ignorar o valor de as estrelas de Elentári é o primeiro passo para a ruína espiritual.",
    "O sangue de Gilraen que corre nas veias dos guardiões de Gondor é o mesmo que outrora desafiou as hostes de ferro sob o céu escuro. Tentar desmerecer a conexão heráldica com Fëanor é ignorar a própria existência e poder de a espada Ringil.",
    "Tua afirmação carece da profundidade histórica dos registros antigos de Cardolan. Se voltarmos aos dias em que Fingolfin guardava o orvalho sagrado de Nienna, perceberemos que os descendentes diretos de Galadriel jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
    "Pois como é sabido por todos os que estudam os anais de Rúmil de Tirion, a linhagem de Huor remete a tempos em que a luz de o cetro de Annúminas ainda não fora obscurecida em Gondor. Lembra-te de Turgon, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Recordo-me, através dos pergaminhos escritos por Elrond Peredhel, que a união de Turgon e Celeborn não foi forjada em debates vazios, mas sob a bênção das estrelas em Nevrast. Se eles tivessem tua falta de paciência, o Livro Vermelho do Marco Ocidental jamais teria sido salvo das garras do inimigo.",
    "Recordo-me, através dos pergaminhos escritos por Isildur, que a união de Fëanor e Valandil não foi forjada em debates vazios, mas sob a bênção das estrelas em Cardolan. Se eles tivessem tua falta de paciência, o Elessar de Gondolin jamais teria sido salvo das garras do inimigo.",
    "Contempla a árvore genealógica dos senhores de Alqualondë antes de prosseguir com teus argumentos. Pois de Elendil o Alto veio a linhagem que guardou a coroa alada de Elendil enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Arwen Undómiel.",
    "Pois como é sabido por todos os que estudam os anais de Isildur, a linhagem de Glorfindel remete a tempos em que a luz de o Elmo de Dragão de Dor-lómin ainda não fora obscurecida em Arthedain. Lembra-te de Arwen Undómiel, cujo legado de sabedoria e coragem moldou o próprio destino de Arda.",
    "Se percorreres a linhagem sagrada que liga Eärendil a Valandil, verás que a herança espiritual de Minas Ithil não se perdeu no tempo. Ela brilha como o espelho de água de Galadriel sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Tua afirmação carece da profundidade histórica dos registros antigos de Nargothrond. Se voltarmos aos dias em que Húrin guardava a coroa alada de Elendil, perceberemos que os descendentes diretos de Gil-galad jamais aceitariam tal premissa sem antes consultar os senhores da sabedoria.",
    "Tua pressa em julgar as decisões de Elrond assemelha-se à tolice dos que ignoraram as advertências de Isildur antes da queda inevitável de Dor-lómin. Se tivesses contemplado a história profunda de a coroa alada de Elendil, não proferirias tamanha leviandade nesta corte.",
    "Se percorreres a linhagem sagrada que liga Gilraen a Fingolfin, verás que a herança espiritual de Dor-lómin não se perdeu no tempo. Ela brilha como as estrelas de Elentári sob o firmamento, guiando aqueles que não se deixam corromper pela pressa do mundo.",
    "Contempla a árvore genealógica dos senhores de Tirion antes de prosseguir com teus argumentos. Pois de Tuor veio a linhagem que guardou a Estrela de Eärendil enquanto as sombras cresciam em Angmar. Tua pressa em julgar ignora a paciência centenária de Círdan.",
  ],
  nature: [
    "Nas profundezas de Formenos, onde a luz de o Livro Vermelho do Marco Ocidental mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Huor. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "As planícies de Lothlórien estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Turgon. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de a chama dourada de Laurelin.",
    "O sussurro das folhas de Nimloth o Reto em Eregion repete a antiga melodia que Valandil cantava antes de a harpa de Daeron se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "Nas profundezas de Arthedain, onde a luz de a gema Elessar mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Fëanor. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "As colinas verdejantes sob a guarda de Lúthien Tinúviel em Doriath florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de a luz prateada de Telperion sob o céu noturno.",
    "Se tivesses a paciência de Gil-galad, entenderias que o crescimento das florestas de Doriath não segue a brevidade dos mortais. As raízes mergulham fundo em busca de a espada Ringil, alheias aos ruidos passageiros do mundo exterior.",
    "As planícies de Lothlórien estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Ecthelion da Fonte. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de o Elmo de Dragão de Dor-lómin.",
    "As águas de Bruinen, que fluem com uma paciência que tu claramente não possuis, viram a ascensão e queda de Angmar. Cada seixo no leito daquele rio guarda a memória de quando Anárion caminhava sob as estrelas em posse de a luz prateada de Telperion.",
    "A luz que incide sobre os picos nevados de Fanuidhol ao amanhecer revela a textura áspera da rocha onde Gilraen outrora plantou o Silmaril resgatado. Há mais sabedoria no ciclo silencioso da geada de Rhudaur do que em tua pressa e arrogância.",
    "Como a brisa suave que sopra sobre Montanhas Azuis e acaricia as folhas de Hírilorn, a sabedoria da natureza nos ensina a esperar. Lúthien Tinúviel sabia disso quando escondeu a Estrela de Eärendil nos vales profundos de Lothlórien, longe da pressa do mundo.",
    "O sussurro das folhas de Laurelin em Formenos repete a antiga melodia que Melian a Maia cantava antes de as duas Árvores de Valinor se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "Se tivesses a paciência de Elrond, entenderias que o crescimento das florestas de Dor-lómin não segue a brevidade dos mortais. As raízes mergulham fundo em busca de o orvalho sagrado de Nienna, alheias aos ruidos passageiros do mundo exterior.",
    "As planícies de Valfenda estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Lúthien Tinúviel. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de a chama dourada de Laurelin.",
    "O sussurro das folhas de Telperion em Valinor repete a antiga melodia que Ecthelion da Fonte cantava antes de o Livro Vermelho do Marco Ocidental se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "As colinas verdejantes sob a guarda de Ecthelion da Fonte em Nargothrond florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de o Elessar de Gondolin sob o céu noturno.",
    "As planícies de Dor-lómin estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Anárion. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de a gema Elessar.",
    "Como a brisa suave que sopra sobre Caradhras e acaricia as folhas de Mallorn, a sabedoria da natureza nos ensina a esperar. Gil-galad sabia disso quando escondeu a coroa alada de Elendil nos vales profundos de Arthedain, longe da pressa do mundo.",
    "As águas de Mitheithel, que fluem com uma paciência que tu claramente não possuis, viram a ascensão e queda de Gondor. Cada seixo no leito daquele rio guarda a memória de quando Elrond caminhava sob as estrelas em posse de o Nauglamír.",
    "As planícies de Minas Anor estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Celeborn. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de o Anel de Barahir.",
    "As planícies de Nevrast estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Elrond. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de o Elessar de Gondolin.",
    "A luz que incide sobre os picos nevados de Taniquetil ao amanhecer revela a textura áspera da rocha onde Círdan outrora plantou a luz prateada de Telperion. Há mais sabedoria no ciclo silencioso da geada de Eregion do que em tua pressa e arrogância.",
    "Contempla a harmonia das florestas de Lindon antes de propor tuas ideias apressadas. As raízes de Galathilion conversam com as águas de Loudwater sobre o tempo em que Galadriel guardava os fios de ouro de Galadriel longe do alcance dos homens gananciosos.",
    "O sussurro das folhas de Hírilorn em Rivendell repete a antiga melodia que Elros Tar-Minyatur cantava antes de o espelho de água de Galadriel se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "As planícies de Osgiliath estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Elros Tar-Minyatur. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de os fios de ouro de Galadriel.",
    "As colinas verdejantes sob a guarda de Finrod Felagund em Rivendell florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de o espelho de água de Galadriel sob o céu noturno.",
    "A luz que incide sobre os picos nevados de Taniquetil ao amanhecer revela a textura áspera da rocha onde Fingolfin outrora plantou a espada Ringil. Há mais sabedoria no ciclo silencioso da geada de Lindon do que em tua pressa e arrogância.",
    "O vento que sopra das colinas de Osgiliath carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre o orvalho sagrado de Nienna. Observa como as folhas dos bosques de Gilraen caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "As colinas verdejantes sob a guarda de Fingolfin em Gondolin florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de a flor branca niphredil sob o céu noturno.",
    "A luz que incide sobre os picos nevados de Fanuidhol ao amanhecer revela a textura áspera da rocha onde Huor outrora plantou as estrelas de Elentári. Há mais sabedoria no ciclo silencioso da geada de Hithlum do que em tua pressa e arrogância.",
    "Contempla a harmonia das florestas de Arthedain antes de propor tuas ideias apressadas. As raízes de o Salgueiro-homem conversam com as águas de Loudwater sobre o tempo em que Eldarion guardava o cetro de Annúminas longe do alcance dos homens gananciosos.",
    "Se tivesses a paciência de Celebrimbor, entenderias que o crescimento das florestas de Rhudaur não segue a brevidade dos mortais. As raízes mergulham fundo em busca de as duas Árvores de Valinor, alheias aos ruidos passageiros do mundo exterior.",
    "Contempla a harmonia das florestas de Rivendell antes de propor tuas ideias apressadas. As raízes de o Salgueiro-homem conversam com as águas de Loudwater sobre o tempo em que Huor guardava a gema Elessar longe do alcance dos homens gananciosos.",
    "Como a brisa suave que sopra sobre Celebdil e acaricia as folhas de Laurelin, a sabedoria da natureza nos ensina a esperar. Tuor sabia disso quando escondeu o Nauglamír nos vales profundos de Tirion, longe da pressa do mundo.",
    "A luz que incide sobre os picos nevados de Montanhas Azuis ao amanhecer revela a textura áspera da rocha onde Fingolfin outrora plantou os fios de ouro de Galadriel. Há mais sabedoria no ciclo silencioso da geada de Eregion do que em tua pressa e arrogância.",
    "As planícies de Tirion estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Círdan. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de o Livro Vermelho do Marco Ocidental.",
    "Nas profundezas de Doriath, onde a luz de o cetro de Annúminas mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Elendil o Alto. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "As colinas verdejantes sob a guarda de Finrod Felagund em Vinyamar florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de a espada Narsil sob o céu noturno.",
    "O vento que sopra das colinas de Dor-lómin carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre as pedras de Palantír. Observa como as folhas dos bosques de Fëanor caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "Contempla a harmonia das florestas de Minas Anor antes de propor tuas ideias apressadas. As raízes de Telperion conversam com as águas de Sirion sobre o tempo em que Eldarion guardava o espelho de água de Galadriel longe do alcance dos homens gananciosos.",
    "Como a brisa suave que sopra sobre Thangorodrim e acaricia as folhas de Nimloth o Reto, a sabedoria da natureza nos ensina a esperar. Gilraen sabia disso quando escondeu a luz de Estel nos vales profundos de Rivendell, longe da pressa do mundo.",
    "Contempla a harmonia das florestas de Cardolan antes de propor tuas ideias apressadas. As raízes de Mallorn conversam com as águas de Anduin sobre o tempo em que Eldarion guardava o Silmaril resgatado longe do alcance dos homens gananciosos.",
    "As planícies de Armenelos estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Gilraen. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de os fios de ouro de Galadriel.",
    "Como a brisa suave que sopra sobre Amon Rûdh e acaricia as folhas de Hírilorn, a sabedoria da natureza nos ensina a esperar. Isildur sabia disso quando escondeu as duas Árvores de Valinor nos vales profundos de Arthedain, longe da pressa do mundo.",
    "O sussurro das folhas de Hírilorn em Lothlórien repete a antiga melodia que Arwen Undómiel cantava antes de o Anel de Barahir se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "Contempla a harmonia das florestas de Beleriand antes de propor tuas ideias apressadas. As raízes de Telperion conversam com as águas de Loudwater sobre o tempo em que Húrin guardava a espada Narsil longe do alcance dos homens gananciosos.",
    "O sussurro das folhas de Hírilorn em Númenor repete a antiga melodia que Húrin cantava antes de a gema Elessar se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "As planícies de Hithlum estendem-se sob o sol como um mar dourado de ervas, onde cada haste se curva ao vento governado por Fëanor. Ali, a harmonia secreta da natureza prepara o solo para o florescer eterno de as estrelas de Elentári.",
    "O vento que sopra das colinas de Arthedain carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre as folhas de ouro de Mallorn. Observa como as folhas dos bosques de Elros Tar-Minyatur caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "As colinas verdejantes sob a guarda de Fingolfin em Arnor florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de a chama dourada de Laurelin sob o céu noturno.",
    "Nas profundezas de Doriath, onde a luz de a chama dourada de Laurelin mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Turgon. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "O vento que sopra das colinas de Rivendell carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre a coroa alada de Elendil. Observa como as folhas dos bosques de Turgon caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "Contempla a harmonia das florestas de Vinyamar antes de propor tuas ideias apressadas. As raízes de Mallorn conversam com as águas de Gelion sobre o tempo em que Elros Tar-Minyatur guardava o Nauglamír longe do alcance dos homens gananciosos.",
    "O vento que sopra das colinas de Nargothrond carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre a Estrela de Eärendil. Observa como as folhas dos bosques de Gilraen caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "Contempla a harmonia das florestas de Hithlum antes de propor tuas ideias apressadas. As raízes de Laurelin conversam com as águas de Sirion sobre o tempo em que Eärendil guardava o Elessar de Gondolin longe do alcance dos homens gananciosos.",
    "Se tivesses a paciência de Isildur, entenderias que o crescimento das florestas de Vinyamar não segue a brevidade dos mortais. As raízes mergulham fundo em busca de o orvalho sagrado de Nienna, alheias aos ruidos passageiros do mundo exterior.",
    "As colinas verdejantes sob a guarda de Elrond em Vinyamar florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de as estrelas de Elentári sob o céu noturno.",
    "Se tivesses a paciência de Ecthelion da Fonte, entenderias que o crescimento das florestas de Rhudaur não segue a brevidade dos mortais. As raízes mergulham fundo em busca de as pedras de Palantír, alheias aos ruidos passageiros do mundo exterior.",
    "Nas profundezas de Nevrast, onde a luz de o Elessar de Gondolin mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Fingolfin. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "Como a brisa suave que sopra sobre Amon Rûdh e acaricia as folhas de Galathilion, a sabedoria da natureza nos ensina a esperar. Aragorn Elessar sabia disso quando escondeu as pedras de Palantír nos vales profundos de Gondor, longe da pressa do mundo.",
    "As águas de Celebrant, que fluem com uma paciência que tu claramente não possuis, viram a ascensão e queda de Minas Anor. Cada seixo no leito daquele rio guarda a memória de quando Elendil o Alto caminhava sob as estrelas em posse de a flor branca niphredil.",
    "O sussurro das folhas de Telperion em Arnor repete a antiga melodia que Elros Tar-Minyatur cantava antes de o orvalho sagrado de Nienna se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "O sussurro das folhas de o Salgueiro-homem em Tirion repete a antiga melodia que Finrod Felagund cantava antes de os fios de ouro de Galadriel se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "O sussurro das folhas de Mallorn em Valinor repete a antiga melodia que Tuor cantava antes de o cetro de Annúminas se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "O sussurro das folhas de Hírilorn em Angmar repete a antiga melodia que Galadriel cantava antes de a espada Narsil se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "Nas profundezas de Minas Anor, onde a luz de a coroa alada de Elendil mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Eärendil. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
    "As colinas verdejantes sob a guarda de Galadriel em Armenelos florescem apenas onde a sombra de Morgoth jamais ousou repousar. A grama niphredil cresce ali, nutrida pelo orvalho que brilha como a luz de a flor branca niphredil sob o céu noturno.",
    "Se tivesses a paciência de Arwen Undómiel, entenderias que o crescimento das florestas de Lothlórien não segue a brevidade dos mortais. As raízes mergulham fundo em busca de a luz de Estel, alheias aos ruidos passageiros do mundo exterior.",
    "O vento que sopra das colinas de Númenor carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre o Elessar de Gondolin. Observa como as folhas dos bosques de Círdan caem num ritmo que desafia o próprio tempo, tornando-se ouro antes de tocar o solo sagrado.",
    "O sussurro das folhas de Nimloth o Reto em Tirion repete a antiga melodia que Lúthien Tinúviel cantava antes de o Nauglamír se perder nas sombras. Apenas aqueles que sabem ouvir a terra em silêncio conseguem compreender tal mistério.",
    "Nas profundezas de Angmar, onde a luz de as folhas de ouro de Mallorn mal consegue penetrar entre as copas das árvores, as criaturas da floresta seguem a canção antiga de Glorfindel. Cada broto que nasce ali é um testemunho vivo das eras passadas.",
  ],
  philosophy: [
    "A esperança, ou Estel como diziam os antigos sábios de Beleriand, é uma chama pequena mantida por Finrod Felagund contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de as estrelas de Elentári logo silenciará.",
    "Muitos que vivem em Eregion merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Círdan conseguem ver todos os fins sob o orvalho sagrado de Nienna, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "A sabedoria não reside em acumular pergaminhos em Minas Anor, mas em compreender o silêncio de Círdan diante do brilho de a espada Ringil. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "O destino de Arda, tecido sob o olhar atento dos Valar em Alqualondë, não é governado pelo orgulho de Celeborn. Cada fio daquela grande tapeçaria reflete a luz de a Estrela de Eärendil, lembrando-nos de nossa pequenez diante do tempo.",
    "Muitos que vivem em Umbar merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Lúthien Tinúviel conseguem ver todos os fins sob a harpa de Daeron, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "O destino de Arda, tecido sob o olhar atento dos Valar em Umbar, não é governado pelo orgulho de Húrin. Cada fio daquela grande tapeçaria reflete a luz de o Livro Vermelho do Marco Ocidental, lembrando-nos de nossa pequenez diante do tempo.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Tirion, sob as estrelas de Elentári, Húrin ensinou que a paciência diante de a coroa alada de Elendil é a chave para desatar os nós que a dissonância de Círdan teceu na música original.",
    "A sabedoria não reside em acumular pergaminhos em Tirion, mas em compreender o silêncio de Elros Tar-Minyatur diante do brilho de o espelho de água de Galadriel. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "O destino de Arda, tecido sob o olhar atento dos Valar em Gondor, não é governado pelo orgulho de Radagast o Castanho. Cada fio daquela grande tapeçaria reflete a luz de a coroa alada de Elendil, lembrando-nos de nossa pequenez diante do tempo.",
    "A sabedoria não reside em acumular pergaminhos em Lindon, mas em compreender o silêncio de Círdan diante do brilho de as pedras de Palantír. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "A esperança, ou Estel como diziam os antigos sábios de Lothlórien, é uma chama pequena mantida por Aragorn Elessar contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de o Silmaril resgatado logo silenciará.",
    "O tempo é um rio cujas águas não voltam, e Celeborn já nos alertava em Lindon que o destino de Arda está atado a os fios de ouro de Galadriel. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "O tempo é um rio cujas águas não voltam, e Círdan já nos alertava em Rivendell que o destino de Arda está atado a o cetro de Annúminas. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "A sabedoria não reside em acumular pergaminhos em Númenor, mas em compreender o silêncio de Lúthien Tinúviel diante do brilho de as estrelas de Elentári. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Tirion, sob as estrelas de Elentári, Elendil o Alto ensinou que a paciência diante de as duas Árvores de Valinor é a chave para desatar os nós que a dissonância de Celebrimbor teceu na música original.",
    "As sombras em Minas Ithil não podem criar nada de novo, apenas corromper o que já foi feito pela luz de o Anel de Barahir. Se tua fala busca diminuir o outro, ela apenas repete o erro trágico de Isildur antes de sua queda definitiva nos abismos.",
    "A chama de o Anel de Barahir arde silenciosamente em Númenor, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de Arwen Undómiel: o que é eterno não pode ser reivindicado pelo orgulho de Radagast o Castanho.",
    "Quem busca dominar os outros através da retórica vazia em Mithrim esquece que o poder mais forte reside na renúncia. Beren compreendeu isso ao entregar o cetro de Annúminas ao destino determinado pelos Valar sob o conselho de Aragorn Elessar.",
    "A sabedoria não reside em acumular pergaminhos em Formenos, mas em compreender o silêncio de Fëanor diante do brilho de o espelho de água de Galadriel. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "O tempo é um rio cujas águas não voltam, e Finrod Felagund já nos alertava em Gondolin que o destino de Arda está atado a a chama dourada de Laurelin. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "O mundo está mudando, e o que era sólido em Mithrim torna-se sombra sob o peso de o espelho de água de Galadriel. Aqueles que buscam o controle absoluto esquecem a lição de Galadriel: a verdadeira força reside na humildade e na paciência dos simples.",
    "A esperança, ou Estel como diziam os antigos sábios de Dor-lómin, é uma chama pequena mantida por Círdan contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de a espada Ringil logo silenciará.",
    "A sabedoria não reside em acumular pergaminhos em Gondolin, mas em compreender o silêncio de Gilraen diante do brilho de as estrelas de Elentári. Teu orgulho intelectual impede-te de ver a verdade que brilha diante de teus próprios olhos.",
    "O mundo está mudando, e o que era sólido em Beleriand torna-se sombra sob o peso de as estrelas de Elentári. Aqueles que buscam o controle absoluto esquecem a lição de Celebrimbor: a verdadeira força reside na humildade e na paciência dos simples.",
    "Quem busca dominar os outros através da retórica vazia em Lindon esquece que o poder mais forte reside na renúncia. Gilraen compreendeu isso ao entregar o Livro Vermelho do Marco Ocidental ao destino determinado pelos Valar sob o conselho de Gil-galad.",
    "O tempo é um rio cujas águas não voltam, e Beren já nos alertava em Vinyamar que o destino de Arda está atado a as duas Árvores de Valinor. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "O mundo está mudando, e o que era sólido em Lindon torna-se sombra sob o peso de a espada Narsil. Aqueles que buscam o controle absoluto esquecem a lição de Galadriel: a verdadeira força reside na humildade e na paciência dos simples.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Lindon, sob as estrelas de Elentári, Húrin ensinou que a paciência diante de as pedras de Palantír é a chave para desatar os nós que a dissonância de Círdan teceu na música original.",
    "Quem busca dominar os outros através da retórica vazia em Alqualondë esquece que o poder mais forte reside na renúncia. Turgon compreendeu isso ao entregar a espada Ringil ao destino determinado pelos Valar sob o conselho de Melian a Maia.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Valfenda, sob as estrelas de Elentári, Fingolfin ensinou que a paciência diante de a flor branca niphredil é a chave para desatar os nós que a dissonância de Valandil teceu na música original.",
    "Muitos que vivem em Rhudaur merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Elendil o Alto conseguem ver todos os fins sob a espada Narsil, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "O tempo é um rio cujas águas não voltam, e Fëanor já nos alertava em Beleriand que o destino de Arda está atado a o Nauglamír. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "O mundo está mudando, e o que era sólido em Minas Ithil torna-se sombra sob o peso de o espelho de água de Galadriel. Aqueles que buscam o controle absoluto esquecem a lição de Galadriel: a verdadeira força reside na humildade e na paciência dos simples.",
    "As sombras em Dor-lómin não podem criar nada de novo, apenas corromper o que já foi feito pela luz de o espelho de água de Galadriel. Se tua fala busca diminuir o outro, ela apenas repete o erro trágico de Húrin antes de sua queda definitiva nos abismos.",
    "A esperança, ou Estel como diziam os antigos sábios de Minas Ithil, é uma chama pequena mantida por Celeborn contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de o espelho de água de Galadriel logo silenciará.",
    "Muitos que vivem em Valfenda merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Galadriel conseguem ver todos os fins sob a luz prateada de Telperion, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "A esperança, ou Estel como diziam os antigos sábios de Cardolan, é uma chama pequena mantida por Eärendil contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de o Silmaril resgatado logo silenciará.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Umbar, sob as estrelas de Elentári, Aragorn Elessar ensinou que a paciência diante de as pedras de Palantír é a chave para desatar os nós que a dissonância de Fingolfin teceu na música original.",
    "Quem busca dominar os outros através da retórica vazia em Angmar esquece que o poder mais forte reside na renúncia. Eldarion compreendeu isso ao entregar a luz prateada de Telperion ao destino determinado pelos Valar sob o conselho de Thingol.",
    "Muitos que vivem em Númenor merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Valandil conseguem ver todos os fins sob o Anel de Barahir, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "O mundo está mudando, e o que era sólido em Gondor torna-se sombra sob o peso de os fios de ouro de Galadriel. Aqueles que buscam o controle absoluto esquecem a lição de Aragorn Elessar: a verdadeira força reside na humildade e na paciência dos simples.",
    "Quem busca dominar os outros através da retórica vazia em Formenos esquece que o poder mais forte reside na renúncia. Gilraen compreendeu isso ao entregar a luz de Estel ao destino determinado pelos Valar sob o conselho de Galadriel.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Minas Ithil, sob as estrelas de Elentári, Anárion ensinou que a paciência diante de o espelho de água de Galadriel é a chave para desatar os nós que a dissonância de Huor teceu na música original.",
    "O mundo está mudando, e o que era sólido em Gondor torna-se sombra sob o peso de a espada Ringil. Aqueles que buscam o controle absoluto esquecem a lição de Valandil: a verdadeira força reside na humildade e na paciência dos simples.",
    "Muitos que vivem em Doriath merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Elendil o Alto conseguem ver todos os fins sob as pedras de Palantír, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "Muitos que vivem em Minas Ithil merecem o julgamento, e alguns que partiram merecem a permanência. Se nem mesmo os sábios como Lúthien Tinúviel conseguem ver todos os fins sob o Silmaril resgatado, como ousas julgar a história com tanta pressa e pouca profundidade?",
    "Quem busca dominar os outros através da retórica vazia em Formenos esquece que o poder mais forte reside na renúncia. Arwen Undómiel compreendeu isso ao entregar o Livro Vermelho do Marco Ocidental ao destino determinado pelos Valar sob o conselho de Valandil.",
    "A esperança, ou Estel como diziam os antigos sábios de Mithrim, é uma chama pequena mantida por Fingolfin contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de o cetro de Annúminas logo silenciará.",
    "A chama de a espada Ringil arde silenciosamente em Gondolin, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de Huor: o que é eterno não pode ser reivindicado pelo orgulho de Melian a Maia.",
    "A esperança, ou Estel como diziam os antigos sábios de Doriath, é uma chama pequena mantida por Eldarion contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de os fios de ouro de Galadriel logo silenciará.",
    "A esperança, ou Estel como diziam os antigos sábios de Doriath, é uma chama pequena mantida por Anárion contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de a luz prateada de Telperion logo silenciará.",
    "O tempo é um rio cujas águas não voltam, e Thingol já nos alertava em Umbar que o destino de Arda está atado a as folhas de ouro de Mallorn. Gastar teu tempo com palavras vazias é como tentar acender uma tocha na chuva: uma futilidade que apenas esfria o coração.",
    "A chama de o Elessar de Gondolin arde silenciosamente em Beleriand, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de Círdan: o que é eterno não pode ser reivindicado pelo orgulho de Fëanor.",
    "O destino de Arda, tecido sob o olhar atento dos Valar em Mithrim, não é governado pelo orgulho de Isildur. Cada fio daquela grande tapeçaria reflete a luz de o espelho de água de Galadriel, lembrando-nos de nossa pequenez diante do tempo.",
    "As sombras em Osgiliath não podem criar nada de novo, apenas corromper o que já foi feito pela luz de a luz prateada de Telperion. Se tua fala busca diminuir o outro, ela apenas repete o erro trágico de Arwen Undómiel antes de sua queda definitiva nos abismos.",
    "A esperança, ou Estel como diziam os antigos sábios de Armenelos, é uma chama pequena mantida por Elrond contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de o Elmo de Dragão de Dor-lómin logo silenciará.",
    "A chama de a luz de Estel arde silenciosamente em Rhudaur, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de Fëanor: o que é eterno não pode ser reivindicado pelo orgulho de Thingol.",
    "Não deixes que a pressa obscureça tua visão espiritual. Em Cardolan, sob as estrelas de Elentári, Lúthien Tinúviel ensinou que a paciência diante de a harpa de Daeron é a chave para desatar os nós que a dissonância de Huor teceu na música original.",
    "A chama de as duas Árvores de Valinor arde silenciosamente em Valinor, invisível aos olhos daqueles que buscam a glória imediata. Lembra-te das palavras de Gil-galad: o que é eterno não pode ser reivindicado pelo orgulho de Elrond.",
    "A esperança, ou Estel como diziam os antigos sábios de Valinor, é uma chama pequena mantida por Finrod Felagund contra a escuridão crescente. Tuas palavras são apenas ruidos passageiros que a sinfonia eterna de a espada Narsil logo silenciará.",
  ],
};

const ICONS = {
  genealogy: History,
  nature: TreePine,
  philosophy: Sparkles,
};

const API_BASE = window.location.protocol === 'file:' ? 'http://127.0.0.1:3333' : '';

interface OllamaStatus {
  ollamaInstalled: boolean;
  ollamaRunning: boolean;
  modelDownloaded: boolean;
  modelName: string;
}

export default function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [category, setCategory] = useState<Category>('genealogy');
  const [copyStatus, setCopyStatus] = useState('Copiar');
  const [generationStatus, setGenerationStatus] = useState('Textos locais prontos.');
  const [isGenerating, setIsGenerating] = useState(false);

  // Ollama status integration
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isCheckingOllama, setIsCheckingOllama] = useState(true);
  const [isPullingModel, setIsPullingModel] = useState(false);
  const [pullProgress, setPullProgress] = useState({ percent: 0, status: '' });
  const [showSetup, setShowSetup] = useState(false);

  const selectedList = useMemo(() => DATABASE[category], [category]);

  const checkOllama = async () => {
    setIsCheckingOllama(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/status`);
      if (res.ok) {
        const data = await res.json();
        setOllamaStatus(data);
      } else {
        throw new Error('Falha ao checar status');
      }
    } catch (err) {
      console.warn('Erro ao conectar com API do Ollama, usando fallback:', err);
      setOllamaStatus({
        ollamaInstalled: false,
        ollamaRunning: false,
        modelDownloaded: false,
        modelName: 'qwen2.5:3b'
      });
    } finally {
      setIsCheckingOllama(false);
    }
  };

  const pullModel = async () => {
    setIsPullingModel(true);
    setPullProgress({ percent: 0, status: 'Iniciando download...' });
    try {
      const res = await fetch(`${API_BASE}/api/ollama/pull`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Falha ao iniciar o download.');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming não suportado pelo navegador.');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.status) {
              let percent = 0;
              if (data.completed && data.total) {
                percent = Math.round((data.completed / data.total) * 100);
              }
              setPullProgress({
                percent,
                status: data.status + (percent > 0 ? ` (${percent}%)` : '')
              });
            }
          } catch (e) {
            // Ignora linhas parciais ou de controle
          }
        }
      }

      setPullProgress({ percent: 100, status: 'Download concluído!' });
      await checkOllama();
    } catch (err) {
      console.error('Erro no download:', err);
      setPullProgress({ percent: 0, status: 'Erro ao baixar. Tente novamente.' });
    } finally {
      setIsPullingModel(false);
    }
  };

  const generateLocalQuote = () => {
    const randomIndex = Math.floor(Math.random() * selectedList.length);
    setGeneratedText(selectedList[randomIndex]);
    setCopyStatus('Copiar');
  };

  const generateQuote = async () => {
    setIsGenerating(true);
    setGenerationStatus('Consultando o oráculo local...');

    try {
      const response = await fetch(`${API_BASE}/api/lero-lero`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      const payload = await response.json();

      if (!response.ok || typeof payload.text !== 'string') {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Falha ao gerar texto.');
      }

      setGeneratedText(payload.text);
      setCopyStatus('Copiar');
      setGenerationStatus(`Gerado com ${payload.model ?? 'modelo local'}.`);
    } catch {
      generateLocalQuote();
      checkOllama();
      setGenerationStatus('Ollama indisponível. Usei um pergaminho local.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyStatus('Copiado!');
      window.setTimeout(() => setCopyStatus('Copiar'), 2000);
    } catch {
      setCopyStatus('Falhou');
      window.setTimeout(() => setCopyStatus('Copiar'), 2000);
    }
  };

  useEffect(() => {
    checkOllama();
  }, []);

  useEffect(() => {
    generateLocalQuote();
  }, [category]);

  const ollamaReady = !!(ollamaStatus?.ollamaInstalled && ollamaStatus?.ollamaRunning && ollamaStatus?.modelDownloaded);
  const statusText = isCheckingOllama 
    ? 'Verificando IA...' 
    : ollamaReady 
      ? 'IA Local Pronta (Ollama)' 
      : 'IA Indisponível (Manuscritos Offline)';

  return (
    <main className="app-shell">
      <section className="app-container" aria-labelledby="app-title">
        <header className="hero">
          <div className="hero-icon" aria-hidden="true">
            <TreePine size={64} strokeWidth={1.7} />
          </div>
          <h1 id="app-title">Lero Lero de Valfenda</h1>
          <p>Para vencer o oponente pelo cansaço e pela erudição excessiva.</p>
        </header>

        {/* Ollama Status Bar */}
        <div className="status-bar">
          <div className="status-indicator">
            <span className={`status-dot ${ollamaReady ? 'ready' : 'warning'}`}></span>
            <span>{statusText}</span>
          </div>
          <button type="button" className="setup-button" onClick={() => setShowSetup(true)}>
            {ollamaReady ? 'Configurações' : 'Configurar IA'}
          </button>
        </div>

        <nav className="category-grid" aria-label="Categorias">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((item) => {
            const Icon = ICONS[item];
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`category-button ${category === item ? `active ${item}` : ''}`}
              >
                <Icon size={18} />
                <span>{CATEGORY_LABELS[item]}</span>
              </button>
            );
          })}
        </nav>

        <article className="quote-card" aria-live="polite">
          <Quote className="quote-mark quote-mark-start" size={48} aria-hidden="true" />
          <p>{generatedText}</p>
          <Quote className="quote-mark quote-mark-end" size={48} aria-hidden="true" />
        </article>

        <p className="generation-status" aria-live="polite">{generationStatus}</p>

        <div className="actions">
          <button type="button" onClick={generateQuote} className="primary-action" disabled={isGenerating}>
            <RefreshCw size={22} className={isGenerating ? 'spin' : ''} />
            <span>{isGenerating ? 'Invocando IA' : 'Gerar com IA'}</span>
          </button>

          <button type="button" onClick={copyToClipboard} className="secondary-action">
            <Copy size={20} />
            <span>{copyStatus}</span>
          </button>
        </div>

        <footer className="lore-footer">
          <div aria-hidden="true" />
          <p>Não responda ao tolo com a mesma loucura, responda com mil anos de história que ele terá preguiça de ler.</p>
          <span>Arquivos Reais de Minas Tirith</span>
        </footer>
      </section>

      {/* Ollama Setup Modal */}
      {showSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Santuário de IA de Valfenda</h2>
            <p className="modal-subtitle">Configure o modelo local de inteligência artificial para gerar reprimendas inéditas.</p>
            
            <div className="status-list">
              <div className="status-item">
                <span>Ollama Instalado:</span>
                <span className={`badge ${ollamaStatus?.ollamaInstalled ? 'success' : 'danger'}`}>
                  {ollamaStatus?.ollamaInstalled ? 'Sim' : 'Não'}
                </span>
              </div>
              
              <div className="status-item">
                <span>Ollama Iniciado:</span>
                <span className={`badge ${ollamaStatus?.ollamaRunning ? 'success' : 'danger'}`}>
                  {ollamaStatus?.ollamaRunning ? 'Sim' : 'Não'}
                </span>
              </div>

              <div className="status-item">
                <span>Modelo de IA ({ollamaStatus?.modelName || 'qwen2.5:3b'}):</span>
                <span className={`badge ${ollamaStatus?.modelDownloaded ? 'success' : 'danger'}`}>
                  {ollamaStatus?.modelDownloaded ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>

            <div className="setup-actions">
              {!ollamaStatus?.ollamaInstalled && (
                <div className="setup-instruction">
                  <p>Ollama não foi detectado no sistema. Instale abrindo o terminal e rodando:</p>
                  <code>curl -fsSL https://ollama.com/install.sh | sh</code>
                  <p className="help-text">Após a instalação, clique em Recarregar Status.</p>
                </div>
              )}

              {ollamaStatus?.ollamaInstalled && !ollamaStatus?.ollamaRunning && (
                <div className="setup-instruction">
                  <p>O serviço do Ollama está instalado mas não está rodando.</p>
                  <p className="help-text">Tente iniciá-lo executando <code>ollama serve</code> no terminal ou abrindo o aplicativo Ollama.</p>
                </div>
              )}

              {ollamaStatus?.ollamaRunning && !ollamaStatus?.modelDownloaded && (
                <div className="setup-download">
                  <p>O modelo de IA <strong>{ollamaStatus?.modelName}</strong> precisa ser baixado (~1.9 GB).</p>
                  {isPullingModel ? (
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${pullProgress.percent}%` }}></div>
                      </div>
                      <span className="progress-label">{pullProgress.status}</span>
                    </div>
                  ) : (
                    <button type="button" className="download-button" onClick={pullModel}>
                      Baixar Modelo do Ollama
                    </button>
                  )}
                </div>
              )}

              {ollamaReady && (
                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>
                  <p>Tudo pronto! O oráculo de Valfenda está em plena harmonia com a IA local.</p>
                </div>
              )}
            </div>

            <div className="modal-footer-buttons">
              <button type="button" className="btn-close" onClick={() => setShowSetup(false)} disabled={isPullingModel}>
                Fechar
              </button>
              <button type="button" className="btn-retry" onClick={checkOllama} disabled={isCheckingOllama || isPullingModel}>
                {isCheckingOllama ? 'Checando...' : 'Recarregar Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
