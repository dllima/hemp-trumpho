import './Home.css'
import { useState } from 'react'
import { baralhoCompleto, embaralhar, type Atributo, type CartaGenetica } from '@hemp-trumpho/engine'
import { nomes, icones } from '../utils/atributos'

type Modo = 'rapido' | 'medio' | 'completo'

// Os 7 atributos reais do jogo (par THC/CBD primeiro, como no jogo).
const ATRIBUTOS: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

// Só as cartas genéticas do baralho real (descarta VANTAGEM/REVÉS).
const GENETICAS = baralhoCompleto.filter((c): c is CartaGenetica => c.tipo === 'genetica')

// Atributos de escala 0-100 (exclui thc/cbd, que são %) — base do "destaque".
const ESCALA: Atributo[] = ['relaxamento', 'foco', 'felicidade', 'fome', 'sono']

// Atributo de MAIOR valor entre os de escala 0-100. Empate fica com o primeiro
// na ordem de ESCALA (comparação estrita > preserva o anterior) — determinístico.
function destaqueDe(c: CartaGenetica): Atributo {
  return ESCALA.reduce((melhor, attr) => (c[attr] > c[melhor] ? attr : melhor), ESCALA[0])
}

// Ícone SVG do atributo (/cartas/icones/<attr>.svg), com fallback no emoji se o
// arquivo faltar — mesmo padrão do componente Carta. Invertido para branco para
// contrastar no fundo escuro da Home.
function IconeAtributo({ attr }: { attr: Atributo }) {
  const [semSvg, setSemSvg] = useState(false)
  if (semSvg) return <span style={{ fontSize: '1.4rem' }}>{icones[attr]}</span>
  return (
    <img
      src={`/cartas/icones/${attr}.svg`}
      alt=""
      aria-hidden
      style={{ width: 28, height: 28, filter: 'brightness(0) invert(1)' }}
      onError={() => setSemSvg(true)}
    />
  )
}

// Foto da strain com fallback webp → jpg → placeholder. Cada onError só AVANÇA
// a fase, nunca reaponta para um src que já falhou (evita loop) — mesmo padrão
// do componente Carta. As cartas do hero são fixas na visita, então não há
// necessidade de reset entre rodadas.
function FotoStrain({ id, nome }: { id: string; nome: string }) {
  const [fase, setFase] = useState<'webp' | 'jpg' | 'erro'>('webp')
  if (fase === 'erro') {
    return <div className="card-photo-fallback">🌿</div>
  }
  const base = `/cartas/fotos/${id.toLowerCase()}`
  return (
    <img
      src={fase === 'webp' ? `${base}.webp` : `${base}.jpg`}
      alt={nome}
      onError={() => setFase(f => (f === 'webp' ? 'jpg' : 'erro'))}
    />
  )
}

// Landing/home do jogo. Os botões de AÇÃO (iniciar partida) chamam onIniciar;
// os links de NAVEGAÇÃO interna (#modos, #como-funciona, #atributos) continuam
// como <a href> para o scroll suave da própria página.
export function Home({ onIniciar }: { onIniciar: (modo: Modo) => void }) {
  // Cartas em destaque sorteadas UMA vez por visita (lazy useState não
  // re-sorteia em re-render). 7 distintas: 3 para o hero, 4 para a prévia.
  const [destaques] = useState<CartaGenetica[]>(
    () => embaralhar(GENETICAS).slice(0, 7) as CartaGenetica[]
  )
  const cartasHero = destaques.slice(0, 3)
  const cartasPrevia = destaques.slice(3, 7)

  return (
    <div className="home-root">
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="brand">
            <img className="brand-logo" src="/logo-hemp-trumpho.png" alt="Logo Hemp Trumpho" />
            <div className="brand-text">
              <strong>Hemp Trumpho</strong>
              <span>O jogo de cartas das genéticas</span>
            </div>
          </a>

          <nav className="nav">
            <a href="#como-funciona">Como jogar</a>
            <a href="#modos">Modos</a>
            <a href="#atributos">Atributos</a>
            {/* CTA genérico → modo padrão (médio) */}
            <button className="btn btn-primary nav-cta" onClick={() => onIniciar('medio')}>Jogar agora</button>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Jogo online • PC e mobile</span>
              <h1>Hemp <span>Trumpho</span></h1>
              <p className="lead">
                O jogo online de cartas das genéticas. Compare atributos, vença rodadas
                e descubra quem domina o baralho.
              </p>

              <div className="chip-list">
                <div className="chip">28 genéticas</div>
                <div className="chip">7 atributos</div>
                <div className="chip">partidas rápidas</div>
                <div className="chip">jogue em qualquer lugar</div>
              </div>

              <div className="hero-actions">
                {/* CTA genérico → modo padrão (médio) */}
                <button className="btn btn-primary" onClick={() => onIniciar('medio')}>Jogar agora</button>
                <a href="#como-funciona" className="btn btn-secondary">Como jogar</a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="glow"></div>

              <div className="hero-stage">
                <div className="floating-badge badge-1">🏆 Melhor atributo vence</div>
                <div className="floating-badge badge-2">🌿 28 genéticas no baralho</div>
                <div className="floating-badge badge-3">⚡ Partidas rápidas</div>

                {(['left', 'main', 'right'] as const).map((pos, i) => {
                  const c = cartasHero[i]
                  // Central mostra 4 stats; laterais (menores) só 2. A seção
                  // "Atributos" abaixo lista os 7 reais; aqui é só amostra.
                  const qtdStats = pos === 'main' ? 4 : 2
                  return (
                    <div className={`card-preview ${pos}`} key={pos}>
                      <div className="card-photo">
                        {pos === 'main' && <span className="card-badge">{c.id}</span>}
                        <FotoStrain id={c.id} nome={c.nome} />
                      </div>

                      <div className="stats">
                        {ATRIBUTOS.slice(0, qtdStats).map(attr => (
                          <div className="stat" key={attr}>
                            <span>{nomes[attr]}</span>
                            <strong>{attr === 'thc' || attr === 'cbd' ? `${c[attr]}%` : c[attr]}</strong>
                          </div>
                        ))}
                        <div className="stat-total">7 atributos no total</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* MODOS */}
        <section id="modos" className="section">
          <div className="container">
            <span className="eyebrow">Escolha seu ritmo</span>
            <h2 className="section-title">Selecione o modo de jogo</h2>
            <p className="section-subtitle">
              Partidas rápidas para jogar em qualquer momento, ou uma disputa mais completa
              para dominar o baralho com calma.
            </p>

            <div className="grid-3">
              <article className="card mode-card">
                <div className="mode-top">
                  <div>
                    <div className="mode-title">Rápido</div>
                    <div className="mode-meta">5 cartas • partida curta</div>
                  </div>
                  <div className="mode-icon">⚡</div>
                </div>

                <ul className="mode-bullets">
                  <li>• Ideal para uma partida relâmpago</li>
                  <li>• Ótimo para jogar no celular</li>
                  <li>• Decisões rápidas, sem enrolação</li>
                </ul>

                <button className="btn btn-primary" onClick={() => onIniciar('rapido')}>Jogar rápido</button>
              </article>

              <article className="card mode-card">
                <div className="mode-top">
                  <div>
                    <div className="mode-title">Médio</div>
                    <div className="mode-meta">10 cartas • partida equilibrada</div>
                  </div>
                  <div className="mode-icon">🎯</div>
                </div>

                <ul className="mode-bullets">
                  <li>• Mistura boa entre velocidade e estratégia</li>
                  <li>• Melhor opção para a maioria dos jogadores</li>
                  <li>• Partidas com mais viradas</li>
                </ul>

                <button className="btn btn-primary" onClick={() => onIniciar('medio')}>Jogar médio</button>
              </article>

              <article className="card mode-card">
                <div className="mode-top">
                  <div>
                    <div className="mode-title">Completo</div>
                    <div className="mode-meta">15 cartas • experiência total</div>
                  </div>
                  <div className="mode-icon">🏆</div>
                </div>

                <ul className="mode-bullets">
                  <li>• Mais cartas, mais disputa e mais estratégia</li>
                  <li>• Melhor para quem quer explorar o baralho</li>
                  <li>• Partida mais longa e competitiva</li>
                </ul>

                <button className="btn btn-primary" onClick={() => onIniciar('completo')}>Jogar completo</button>
              </article>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="section">
          <div className="container">
            <span className="eyebrow">Aprenda em segundos</span>
            <h2 className="section-title">Como funciona o Hemp Trumpho</h2>
            <p className="section-subtitle">
              O jogo é simples de entender e rápido de começar, mas ainda deixa espaço para
              estratégia em cada rodada.
            </p>

            <div className="steps">
              <article className="card">
                <div className="step-number">1</div>
                <h3 className="step-title">Receba suas cartas</h3>
                <p className="step-text">
                  Cada partida distribui cartas com genéticas diferentes, cada uma com
                  atributos próprios para o confronto.
                </p>
              </article>

              <article className="card">
                <div className="step-number">2</div>
                <h3 className="step-title">Escolha um atributo</h3>
                <p className="step-text">
                  Analise sua carta e selecione o atributo que pode superar o valor da
                  carta adversária.
                </p>
              </article>

              <article className="card">
                <div className="step-number">3</div>
                <h3 className="step-title">Vença a rodada</h3>
                <p className="step-text">
                  O melhor valor leva a rodada. Quem dominar mais confrontos, domina
                  o baralho e vence a partida.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ATRIBUTOS */}
        <section id="atributos" className="section">
          <div className="container">
            <span className="eyebrow">O que decide o confronto</span>
            <h2 className="section-title">Atributos das cartas</h2>
            <p className="section-subtitle">
              Cada genética possui características próprias. Escolher o atributo certo
              no momento certo pode virar a partida.
            </p>

            <div className="attr-grid">
              {ATRIBUTOS.map(attr => (
                <div className="attr-card" key={attr}>
                  <span><IconeAtributo attr={attr} /></span>
                  <strong>{nomes[attr]}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRÉVIA DE CARTAS */}
        <section className="section">
          <div className="container">
            <span className="eyebrow">Prévia do baralho</span>
            <h2 className="section-title">Algumas cartas do Hemp Trumpho</h2>
            <p className="section-subtitle">
              Uma amostra do universo do jogo: genéticas, estilos e confrontos que fazem
              cada partida ficar diferente.
            </p>

            <div className="grid-4">
              {cartasPrevia.map(c => {
                const dest = destaqueDe(c)
                return (
                  <article className="mini-card" key={c.id}>
                    <span className="topline">{c.banco}</span>
                    <img
                      src={`/cartas/fotos/${c.id.toLowerCase()}.webp`}
                      alt={c.nome}
                      style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                    />
                    <h4>{c.nome}</h4>
                    <div className="mini-destaque">{nomes[dest]} <strong>{c[dest]}</strong></div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* POR QUE JOGAR */}
        <section className="section">
          <div className="container">
            <span className="eyebrow">Por que jogar</span>
            <h2 className="section-title">Um card game rápido, temático e competitivo</h2>
            <p className="section-subtitle">
              O Hemp Trumpho foi pensado para funcionar bem tanto em partidas curtas quanto
              em sessões mais completas, sempre com uma leitura fácil no PC e no celular.
            </p>

            <div className="why-grid">
              <article className="card why-item">
                <h4>Partidas rápidas e diretas</h4>
                <p>
                  Entre em uma partida em segundos e jogue sem complicação, seja no desktop
                  ou no celular.
                </p>
              </article>

              <article className="card why-item">
                <h4>Baralho com identidade própria</h4>
                <p>
                  O universo do Hemp Trumpho transforma genéticas e atributos em um sistema
                  de confronto fácil de entender e divertido de explorar.
                </p>
              </article>

              <article className="card why-item">
                <h4>Fácil de aprender</h4>
                <p>
                  As regras são simples o suficiente para começar rápido, mas ainda deixam
                  espaço para decisões estratégicas.
                </p>
              </article>

              <article className="card why-item">
                <h4>Pronto para PC e mobile</h4>
                <p>
                  Interface responsiva, botões grandes e leitura clara para jogar de qualquer
                  lugar.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="jogar" className="section">
          <div className="container">
            <div className="card cta-box">
              <h3>Pronto para dominar o baralho?</h3>
              <p>
                Entre no Hemp Trumpho, escolha seu modo de jogo e comece agora sua próxima disputa.
              </p>

              <div className="cta-actions">
                {/* CTA genérico → modo padrão (médio) */}
                <button className="btn btn-primary" onClick={() => onIniciar('medio')}>Jogar agora</button>
                <a href="#como-funciona" className="btn btn-secondary">Ver regras</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '6px' }}>Hemp Trumpho</strong>
            <span>O jogo de cartas das genéticas.</span>
          </div>

          <div className="footer-links">
            <a href="#como-funciona">Como jogar</a>
            <a href="#modos">Modos</a>
            <a href="#atributos">Atributos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
