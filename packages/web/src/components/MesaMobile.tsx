import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Atributo, CartaGenetica } from '@hemp-trumpho/engine'
import { usePartida } from '../hooks/usePartida'
import { useJogoStore } from '../store/jogoStore'
import { nomes, icones, coresAtributo } from '../utils/atributos'

const ATRIBUTOS: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

// Valor formatado do atributo (thc/cbd em %, igual ao jogo desktop).
function valorAttr(c: CartaGenetica, attr: Atributo) {
  return attr === 'thc' || attr === 'cbd' ? `${c[attr]}%` : `${c[attr]}`
}

// Foto compacta da strain com fallback webp → jpg → placeholder. Mesma máquina
// de fase do Carta.tsx: cada onError só AVANÇA a fase (sem loop).
function FotoMini({ id, nome }: { id: string; nome: string }) {
  const [fase, setFase] = useState<'webp' | 'jpg' | 'erro'>('webp')
  if (fase === 'erro') {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-[#1a5a1a] to-[#0a3a0a]">🌿</div>
    )
  }
  const base = `/cartas/fotos/${id.toLowerCase()}`
  return (
    <img
      src={fase === 'webp' ? `${base}.webp` : `${base}.jpg`}
      alt={nome}
      className="w-full h-full object-cover"
      onError={() => setFase(f => (f === 'webp' ? 'jpg' : 'erro'))}
    />
  )
}

// Ícone do atributo (SVG /cartas/icones/<attr>.svg) com fallback no emoji.
function IconeAttr({ attr }: { attr: Atributo }) {
  const [semSvg, setSemSvg] = useState(false)
  return (
    <span className="w-7 h-7 shrink-0 rounded-full bg-[#f7d515] flex items-center justify-center">
      {semSvg
        ? <span className="text-sm leading-none">{icones[attr]}</span>
        : <img src={`/cartas/icones/${attr}.svg`} alt="" aria-hidden className="w-4 h-4" onError={() => setSemSvg(true)} />}
    </span>
  )
}

// Mesa de jogo no MOBILE (< lg). Componente APENAS de apresentação: consome o
// mesmo estado/ações da Mesa desktop via usePartida()/useJogoStore. NÃO contém
// efeitos colaterais (useIA, auto-resolver especial) — esses vivem só na Mesa,
// para não rodarem em dobro (desktop + mobile montam juntos, um escondido).
export function MesaMobile() {
  const {
    partida, resultadoPendente, jogar, avancar,
    jogadorHumano, jogadorIA, ehMinhaVez, cartaHumano, cartaIA,
  } = usePartida()
  const modo = useJogoStore(s => s.modo)
  const historicoRodadas = useJogoStore(s => s.historicoRodadas)
  const [histAberto, setHistAberto] = useState(false)

  // Segurança: a Mesa só renderiza isto no jogo ativo, mas evita crash se nulo.
  if (!partida) return null

  const revelado = !!resultadoPendente
  const cartaHumanoEspecial = !!cartaHumano && (cartaHumano.tipo === 'vantagem' || cartaHumano.tipo === 'reves')
  const podeEscolher = ehMinhaVez && !revelado && !cartaHumanoEspecial
  const atributoSelecionado = resultadoPendente?.atributo ?? null
  const ehUltimaRodada = resultadoPendente?.proximoEstado.finalizada ?? false

  const cartasOponente = jogadorIA?.cartas.length ?? 0
  const monte = partida.monteEmpate.length
  const total = (jogadorHumano?.cartas.length ?? 0) + cartasOponente + monte

  const vitoriasHumano = historicoRodadas.filter(r => r.resultado === 'vitoria').length
  const vitoriasOponente = historicoRodadas.filter(r => r.resultado === 'derrota').length

  const resultadoTexto = !resultadoPendente ? '' :
    resultadoPendente.vencedorId === jogadorHumano?.id ? (ehUltimaRodada ? '🏆 Você venceu o jogo!' : '🎉 Você venceu a rodada!') :
    resultadoPendente.vencedorId === jogadorIA?.id ? (ehUltimaRodada ? '💀 Oponente venceu o jogo!' : '😞 Oponente venceu a rodada!') :
    '🤝 Empate! Cartas vão para o monte'

  const humanoGen = cartaHumano?.tipo === 'genetica' ? (cartaHumano as CartaGenetica) : null
  const iaGen = cartaIA?.tipo === 'genetica' ? (cartaIA as CartaGenetica) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-hemp-dark to-black p-3 text-white">
      {/* 1. BARRA COMPACTA: modo · rodada · vez · placar */}
      <div className="flex items-center justify-between gap-2 text-xs mb-2">
        <span className="bg-hemp-dark border border-hemp-gold/40 px-2.5 py-1 rounded-full text-hemp-gold">
          {({ rapido: '⚡ Rápido', medio: '🎯 Médio', completo: '🏆 Completo' })[modo]}
        </span>
        <span className="text-gray-300">Rodada <strong className="text-hemp-gold">{partida.rodada}</strong></span>
        <span className={`px-2.5 py-1 rounded-full font-semibold ${ehMinhaVez ? 'bg-hemp-green text-white' : 'bg-hemp-purple text-white'}`}>
          {ehMinhaVez ? '🔥 Sua vez' : '⏳ Oponente'}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm mb-4">
        <span className="text-green-400 font-bold">Você {vitoriasHumano}</span>
        <span className="text-gray-500">×</span>
        <span className="text-red-400 font-bold">{vitoriasOponente} Oponente</span>
      </div>

      {/* 2. CARTAS LADO A LADO */}
      <div className="flex items-start justify-center gap-2 mb-4">
        {/* SUA CARTA (visual real, compacta) */}
        <div className="flex-1 max-w-[44%]">
          <div className="relative rounded-xl overflow-hidden border-2 border-[#f7d515] bg-[#0a4d3c]">
            <div className="relative h-32">
              {humanoGen
                ? <FotoMini id={humanoGen.id} nome={humanoGen.nome} />
                : <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-yellow-500 to-red-700">{cartaHumano?.tipo === 'vantagem' ? '⭐' : '💀'}</div>}
              {humanoGen && (
                <span className="absolute top-1 left-1 bg-[#4ade80] text-[#0a4d3c] font-extrabold text-[10px] px-1.5 py-0.5 rounded">{humanoGen.id}</span>
              )}
              {humanoGen && (
                <span className="absolute top-1 right-1 bg-[#4ade80] text-[#0a4d3c] font-bold text-[9px] px-1.5 py-0.5 rounded">{humanoGen.banco}</span>
              )}
            </div>
            <div className="p-2 text-center">
              <p className="text-[#f7d515] font-bold text-xs leading-tight truncate">{cartaHumano?.nome}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Sua carta</p>
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="self-center text-xl font-bold text-hemp-gold">VS</div>

        {/* OPONENTE */}
        <div className="flex-1 max-w-[44%]">
          {!revelado ? (
            // Verso reduzido enquanto não revelado.
            <div className="rounded-xl overflow-hidden border-2 border-gray-600 bg-hemp-dark">
              <div className="h-32 flex items-center justify-center bg-gradient-to-br from-hemp-green to-hemp-dark">
                <img src="/logo-hemp-trumpho.png" alt="" className="w-16 opacity-90" />
              </div>
              <div className="p-2 text-center">
                <p className="text-gray-300 font-bold text-xs">Oponente</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{cartasOponente} cartas</p>
              </div>
            </div>
          ) : (
            // Revelada: carta real do oponente (foto + atributos) para ver o resultado.
            <div className="rounded-xl overflow-hidden border-2 border-gray-500 bg-[#0a4d3c]">
              <div className="relative h-32">
                {iaGen
                  ? <FotoMini id={iaGen.id} nome={iaGen.nome} />
                  : <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-yellow-500 to-red-700">{cartaIA?.tipo === 'vantagem' ? '⭐' : '💀'}</div>}
                {iaGen && (
                  <span className="absolute top-1 left-1 bg-[#4ade80] text-[#0a4d3c] font-extrabold text-[10px] px-1.5 py-0.5 rounded">{iaGen.id}</span>
                )}
                {iaGen && (
                  <span className="absolute top-1 right-1 bg-[#4ade80] text-[#0a4d3c] font-bold text-[9px] px-1.5 py-0.5 rounded">{iaGen.banco}</span>
                )}
              </div>
              <div className="p-2">
                <p className="text-gray-200 font-bold text-xs leading-tight truncate text-center">{cartaIA?.nome}</p>
                {iaGen && (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {ATRIBUTOS.map(attr => {
                      const sel = atributoSelecionado === attr
                      return (
                        <div key={attr} className={`flex justify-between items-center text-[10px] px-1.5 py-0.5 rounded ${sel ? 'bg-[#f7d515]/25 text-[#f7d515] font-bold' : 'text-gray-300'}`}>
                          <span className="uppercase">{nomes[attr]}</span>
                          <span>{valorAttr(iaGen, attr)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. RESULTADO + CTA (revelado) ou prompt da vez */}
      {revelado ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 bg-hemp-dark/80 border border-hemp-gold/30 rounded-xl p-3"
        >
          <p className="text-base font-bold text-hemp-gold">{resultadoTexto}</p>
          <p className="text-xs text-gray-300 mb-3">{resultadoPendente?.mensagem}</p>
          <button
            onClick={avancar}
            autoFocus
            className="w-full py-3 bg-hemp-gold hover:bg-yellow-400 text-black rounded-xl text-base font-bold transition-all"
          >
            {ehUltimaRodada ? '🏆 Ver Resultado Final' : '▶ Próxima Rodada'}
          </button>
        </motion.div>
      ) : (
        <p className="text-center text-xs text-gray-400 mb-3">
          {ehMinhaVez
            ? (cartaHumanoEspecial ? '✨ Carta especial! Resolvendo…' : '👇 Escolha um atributo')
            : '⏳ Oponente está jogando...'}
        </p>
      )}

      {/* 3. LISTA DE ATRIBUTOS (carta do humano) — alvo de toque ≥44px */}
      {humanoGen && (
        <div className="flex flex-col gap-1.5 mb-4">
          {ATRIBUTOS.map(attr => {
            const sel = atributoSelecionado === attr
            return (
              <button
                key={attr}
                onClick={() => podeEscolher && jogar(attr)}
                disabled={!podeEscolher}
                className={`flex items-center justify-between min-h-[44px] px-3 rounded-lg border transition-all
                  ${sel ? 'bg-[#f7d515]/20 border-[#f7d515]' : 'border-hemp-gold/20 bg-hemp-dark/60'}
                  ${podeEscolher ? 'active:scale-[0.98] hover:bg-hemp-light/40' : 'opacity-60'}`}
              >
                <span className={`flex items-center gap-2 ${coresAtributo[attr]}`}>
                  <IconeAttr attr={attr} />
                  <span className="uppercase text-sm font-semibold">{nomes[attr]}</span>
                </span>
                <span className="font-bold text-hemp-gold">{valorAttr(humanoGen, attr)}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* 4. MONTE + TOTAL */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-hemp-dark/80 border border-hemp-green/30 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 uppercase">Monte de Empate</p>
          <p className="text-xl font-bold text-hemp-gold">{monte}</p>
        </div>
        <div className="bg-hemp-dark/80 border border-hemp-green/30 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400 uppercase">Total no Jogo</p>
          <p className="text-xl font-bold text-hemp-gold">{total}</p>
        </div>
      </div>

      {/* 5. HISTÓRICO COLAPSADO (fechado por padrão) */}
      <div className="bg-hemp-dark/80 border border-hemp-gold/20 rounded-xl">
        <button
          onClick={() => setHistAberto(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-hemp-gold uppercase"
        >
          <span>📜 Histórico ({historicoRodadas.length})</span>
          <span>{histAberto ? '▲' : '▼'}</span>
        </button>
        <AnimatePresence initial={false}>
          {histAberto && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2 max-h-60 overflow-y-auto">
                {historicoRodadas.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Nenhuma rodada jogada ainda.</p>
                )}
                {historicoRodadas.slice(-8).reverse().map(r => {
                  const quemJogou = r.jogadorId === jogadorHumano?.id ? 'Você' : 'Oponente'
                  const cor = r.resultado === 'vitoria' ? 'text-green-400 border-green-400/50'
                    : r.resultado === 'derrota' ? 'text-red-400 border-red-400/50'
                    : 'text-gray-400 border-gray-400/40'
                  const label = r.resultado === 'vitoria' ? 'Você venceu'
                    : r.resultado === 'derrota' ? 'Oponente venceu'
                    : 'Empate'
                  return (
                    <div key={`m-rodada-${r.rodada}`} className={`border-l-2 pl-3 py-1 ${cor}`}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-gray-400">R{r.rodada} · {quemJogou}</span>
                        {r.atributo === 'ESPECIAL' ? (
                          <span className="flex items-center gap-1 font-semibold text-hemp-gold">⭐ ESPECIAL</span>
                        ) : (
                          <span className={`flex items-center gap-1 font-semibold ${coresAtributo[r.atributo]}`}>
                            <span>{icones[r.atributo]}</span>{nomes[r.atributo]}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">
                        {r.cartas.jogador} · <strong className="text-white">{r.valores.jogador}</strong> vs <strong className="text-white">{r.valores.oponente}</strong> · {r.cartas.oponente}
                      </div>
                      <div className="text-xs font-bold">{label}</div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
