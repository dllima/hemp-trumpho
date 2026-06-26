import './Home.css'

type Modo = 'rapido' | 'medio' | 'completo'

// Landing/home do jogo. Os botões de AÇÃO (iniciar partida) chamam onIniciar;
// os links de NAVEGAÇÃO interna (#modos, #como-funciona, #atributos) continuam
// como <a href> para o scroll suave da própria página.
export function Home({ onIniciar }: { onIniciar: (modo: Modo) => void }) {
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

                <div className="card-preview left">
                  <div className="card-tag">Carta rival</div>
                  <div className="card-name">Purple Haze</div>
                  <div className="card-type">Sativa clássica</div>

                  <div className="stats">
                    <div className="stat"><span>THC</span><strong>22</strong></div>
                    <div className="stat"><span>Aroma</span><strong>18</strong></div>
                    <div className="stat"><span>Potência</span><strong>20</strong></div>
                  </div>
                </div>

                <div className="card-preview main">
                  <div className="card-tag">Carta em destaque</div>
                  <div className="card-name">Lemon Kush</div>
                  <div className="card-type">Híbrida cítrica</div>

                  <div className="stats">
                    <div className="stat"><span>THC</span><strong>25</strong></div>
                    <div className="stat"><span>CBD</span><strong>9</strong></div>
                    <div className="stat"><span>Sabor</span><strong>21</strong></div>
                    <div className="stat"><span>Potência</span><strong>24</strong></div>
                  </div>
                </div>

                <div className="card-preview right">
                  <div className="card-tag">Carta rival</div>
                  <div className="card-name">OG Gold</div>
                  <div className="card-type">Índica potente</div>

                  <div className="stats">
                    <div className="stat"><span>CBD</span><strong>11</strong></div>
                    <div className="stat"><span>Produção</span><strong>19</strong></div>
                    <div className="stat"><span>Potência</span><strong>23</strong></div>
                  </div>
                </div>
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
              <div className="attr-card">
                <span>Atributo</span>
                <strong>THC</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>CBD</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>Sativa</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>Índica</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>Sabor</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>Potência</strong>
              </div>
              <div className="attr-card">
                <span>Atributo</span>
                <strong>Produção</strong>
              </div>
              <div className="attr-card">
                <span>Atributo extra</span>
                <strong>Especial</strong>
              </div>
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
              <article className="mini-card">
                <span className="topline">Carta rara</span>
                <h4>Blue Dream</h4>
                <p>Equilíbrio entre potência, aroma e jogabilidade.</p>
                <div className="ghost-stats">
                  <div></div><div></div><div></div>
                </div>
              </article>

              <article className="mini-card">
                <span className="topline">Carta híbrida</span>
                <h4>Amnesia Gold</h4>
                <p>Boa escolha para quem gosta de viradas estratégicas.</p>
                <div className="ghost-stats">
                  <div></div><div></div><div></div>
                </div>
              </article>

              <article className="mini-card">
                <span className="topline">Carta clássica</span>
                <h4>Skunk Fire</h4>
                <p>Perfil agressivo e valores fortes em confronto direto.</p>
                <div className="ghost-stats">
                  <div></div><div></div><div></div>
                </div>
              </article>

              <article className="mini-card">
                <span className="topline">Carta especial</span>
                <h4>Critical Haze</h4>
                <p>Uma carta versátil para diferentes estilos de partida.</p>
                <div className="ghost-stats">
                  <div></div><div></div><div></div>
                </div>
              </article>
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
