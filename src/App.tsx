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
    'Pois como e sabido por todos os que estudam os anais de Pengolodh, a linhagem de que falas remete a tempos em que a luz das Arvores ainda nao fora obscurecida. Lembra-te de Hador, o Loirado, pai de Galdor, que por sua vez gerou Huor, cujos descendentes cruzaram as aguas em barcos de cisne, apenas para descobrir que o destino de Arda esta atado aos fios que nem mesmo os Valar ousam tecer sob as estrelas de Varda.',
    'Tua afirmacao carece da profundidade historica dos registros de Gondolin. Se voltarmos aos dias de Finwe, o primeiro dos Noldor a ver a luz de Valinor, perceberemos que a ramificacao dos Teleri, especialmente aqueles que permaneceram nas costas de Beleriand, jamais aceitariam tal premissa sem antes consultar os netos de Elwe, que, como bem sabes, casou-se com Melian, uma Maia de incomparavel sabedoria.',
    'Nao se pode simplesmente proferir tais palavras sem considerar a heranca dos Edain. Desde a travessia das Montanhas Azuis ate o estabelecimento em Numenor sob o cetro de Elros Tar-Minyatur, a historia nos ensina que as raizes da ignorancia sao como as de ervas daninhas em solo mal cuidado por Radagast, o Castanho, cujo amor pelas criaturas pequenas ultrapassa tua compreensao de linhagem.',
    'Contempla a arvore genealogica dos Reis de Arnor e Arthedain antes de prosseguir. Pois de Isildur veio Valandil, e de Valandil uma sucessao de senhores que guardaram os fragmentos de Narsil enquanto as sombras cresciam em Angmar. Tua pressa em julgar e como a de um Hobbit que pula a segunda refeicao matinal sem entender a importancia da tradicao dos Tuk de outrora.',
    'Recordo-me, atraves dos pergaminhos de Isildur, que a linhagem dos Meio-Elfos nao foi forjada em debates vazios, mas no sacrificio de Earendil, o Marinheiro, que com o Silmaril na testa navegou ate o Oeste Proibido. Se ele tivesse a tua falta de paciencia, talvez o Sol e a Lua nunca tivessem sido icados ao firmamento por Arien e Tilion.',
  ],
  nature: [
    'O vento que sopra das colinas de Emyn Muil carrega o cheiro de eras esquecidas, onde o musgo crescia silencioso sobre as pedras de quartzo que outrora brilhavam sob a luz de Telperion. Observa como as folhas dos Mallorn em Lothlorien caem num ritmo que desafia o proprio tempo, tornando-se ouro antes de tocar o solo de grama niphredil, que floresce apenas onde a sombra de Morgoth jamais ousou repousar.',
    'As aguas do Anduin, o Grande Rio, fluem com uma paciencia que tu claramente nao possuis. Elas viram a queda de Osgiliath e o florescer de Ithilien, onde as ervas aromaticas e os arbustos de giesta sussurram segredos aos guardioes que caminham em silencio. Cada seixo naquele leito tem uma historia mais antiga que teus argumentos, polidos por milenios de correntes implacaveis.',
    'Se fosses um Ent, entenderias que nada que valha a pena ser dito pode ser dito rapidamente. As raizes das arvores de Fangorn mergulham fundo em segredos de terra e rocha, conversando com as aguas subterraneas sobre o tempo em que as florestas cobriam toda a Terra-media, de Lindon ate as areias de Harad, sob um ceu que ainda nao conhecia a fumaca das fornalhas de Saruman.',
    'A luz que incide sobre os picos das Montanhas Sombrias ao amanhecer tem um tom de purpura que so pode ser comparado ao manto de Varda. Ela revela a textura aspera do granito e a fragilidade das flores de gelo que nascem onde o ar e rarefeito, lembrando-nos que a beleza da criacao reside no detalhe minucioso da geada, e nao na brevidade de um comentario apressado.',
    'As planicies de Rohan estendem-se sob o sol como um mar de erva dourada, onde cada haste se curva ao desejo do vento Manwe. Nao ha pressa naquelas terras, apenas o ciclo eterno das estacoes que transforma o verde da esperanca no marrom da espera, preparando o solo para o sono profundo do inverno sob o manto branco que cobre os Tumulos dos Reis.',
  ],
  philosophy: [
    'O tempo e um rio cujas aguas nao voltam, mas os ecos de Arda ressoam em cada folha que cai. Como disse Gandalf, nao nos cabe escolher os tempos em que vivemos, mas sim o que fazemos com o tempo que nos e dado. E gastar esse tempo com palavras que nao trazem luz e como tentar acender uma tocha na chuva de Helcaraxe: um esforco futil que apenas nos deixa com as maos frias e o coracao pesado.',
    'Muitos que vivem merecem a morte. E alguns que morrem merecem viver. Podes dar-lhes a vida? Entao nao sejas tao avido em julgar, pois nem os mais sabios conseguem ver todos os fins. A trama de Vaire, a Tecela, e complexa demais para ser compreendida por mentes que buscam apenas a vitoria imediata num campo de batalha de ideias passageiras.',
    'A esperanca, ou Amdir como diziam os antigos, e uma chama pequena que arde mesmo quando o mundo parece entregue ao vazio. Mas existe tambem a Estel, a confianca inabalavel de que o fim da cancao sera harmonioso, apesar das dissonancias de Melkor. Tuas palavras sao apenas ruidos na musica, destinados a serem absorvidos pela sinfonia final de Eru Iluvatar.',
    'O mundo esta mudando. Sinto-o na agua, sinto-o na terra, sinto-o no ar. O que era outrora solido torna-se sombra, e o que era ignorado torna-se o pilar da salvacao. Aqueles que buscam dominar os outros atraves do medo esquecem que o poder mais forte reside na humildade de um Hobbit que prefere o conforto de sua toca a gloria das coroas de ferro.',
    'As sombras nao podem criar, apenas corromper o que ja foi feito pela luz. Se tua fala busca diminuir o outro, ela nao e mais do que um eco de Sauron, que desejava ordem atraves do controle absoluto. Mas saiba que a liberdade de Arda e como o voo das Aguias: vasta, indomavel e para sempre fora do alcance daqueles que rastejam na lama do rancor.',
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
