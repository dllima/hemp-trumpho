import { useState, useEffect } from 'react'
import { usePartida } from '../hooks/usePartida'
import { useIA } from '../hooks/useIA'
import { useJogoStore } from '../store/jogoStore'
import { CartaVisual } from './Carta'
import { Home } from './Home'
import { icones, nomes, coresAtributo } from '../utils/atributos'
import { motion, AnimatePresence } from 'framer-motion'

export function Mesa() {
  const {
    partida, resultadoPendente, jogar, avancar,
    jogadorHumano, jogadorIA, ehMinhaVez, cartaHumano, cartaIA
  } = usePartida()

  useIA(1500)

  const historicoRodadas = useJogoStore(s => s.historicoRodadas)
  const iniciarPartida = useJogoStore(s => s.iniciarPartida)
  const modo = useJogoStore(s => s.modo)
  const voltarInicio = useJogoStore(s => s.voltarInicio)

  const revelado = !!resultadoPendente
  const cartaHumanoEspecial = !!cartaHumano && (cartaHumano.tipo === 'vantagem' || cartaHumano.tipo === 'reves')

  // Carta especial do próprio jogador joga sozinha (não há atributo a escolher):
  // resolve a rodada automaticamente (VANTAGEM vence, REVÉS perde) e o jogo segue.
  useEffect(() => {
    if (!ehMinhaVez || revelado || !cartaHumanoEspecial) return
    const t = setTimeout(() => jogar('thc'), 1100)
    return () => clearTimeout(t)
  }, [ehMinhaVez, revelado, cartaHumanoEspecial, jogar])

  if (!partida) {
    return <Home onIniciar={(modo) => iniciarPartida(['Você', 'Oponente'], modo)} />
  }

  if (partida.finalizada) {
    const v = partida.jogadores.find((j: { id: string }) => j.id === partida.vencedor)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black relative overflow-hidden">
        <Confetti />
        <div className="text-center z-10 px-4">
          <motion.h1 className="text-6xl md:text-7xl font-bold text-hemp-gold mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            🏆 Fim de Jogo!
          </motion.h1>
          <p className="text-3xl md:text-4xl mb-2">{v?.nome} venceu!</p>
          <p className="text-gray-400 mb-8">Rodadas: {partida.rodada - 1}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => iniciarPartida(['Você', 'Oponente'], modo)} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white transition-all hover:scale-105">
              🔄 Jogar de novo
            </button>
            <button onClick={() => voltarInicio()} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white transition-all hover:scale-105">
              🎮 Escolher modo
            </button>
          </div>
        </div>
      </div>
    )
  }

  const total = (jogadorHumano?.cartas.length ?? 0) + (jogadorIA?.cartas.length ?? 0) + partida.monteEmpate.length

  const atributoSelecionado = resultadoPendente?.atributo ?? null
  const ehUltimaRodada = resultadoPendente?.proximoEstado.finalizada ?? false

  const resultadoTexto = !resultadoPendente ? '' :
    resultadoPendente.vencedorId === jogadorHumano?.id ? (ehUltimaRodada ? '🏆 Você venceu o jogo!' : '🎉 Você venceu a rodada!') :
    resultadoPendente.vencedorId === jogadorIA?.id ? (ehUltimaRodada ? '💀 Oponente venceu o jogo!' : '😞 Oponente venceu a rodada!') :
    '🤝 Empate! Cartas vão para o monte'

  // Detecta carta especial revelada nesta rodada (para os efeitos de clímax).
  const especialRevelada = !revelado ? null
    : (cartaHumano?.tipo === 'vantagem' || cartaIA?.tipo === 'vantagem') ? 'vantagem'
    : (cartaHumano?.tipo === 'reves' || cartaIA?.tipo === 'reves') ? 'reves'
    : null

  // Placar de rodadas vencidas, derivado do histórico (POV do humano).
  const vitoriasHumano = historicoRodadas.filter(r => r.resultado === 'vitoria').length
  const vitoriasOponente = historicoRodadas.filter(r => r.resultado === 'derrota').length
  const empates = historicoRodadas.filter(r => r.resultado === 'empate').length
  const humanoLidera = vitoriasHumano > vitoriasOponente
  const oponenteLidera = vitoriasOponente > vitoriasHumano

  // Proporção de cartas no baralho (humano · monte · oponente), derivada de cartas.length.
  const cartasHumano = jogadorHumano?.cartas.length ?? 0
  const cartasOponente = jogadorIA?.cartas.length ?? 0
  const monte = partida.monteEmpate.length
  const pctHumano = total ? (cartasHumano / total) * 100 : 0
  const pctMonte = total ? (monte / total) * 100 : 0
  const pctOponente = total ? (cartasOponente / total) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-hemp-dark to-black p-4 md:p-8">
      {/* EFEITOS DE CLÍMAX (carta especial) */}
      {especialRevelada === 'vantagem' && <Confetti />}
      {especialRevelada === 'reves' && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-20"
          style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.5) 0%, rgba(0,0,0,0.8) 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 max-w-4xl mx-auto gap-3">
        <h1 className="text-2xl font-bold text-hemp-gold">🌿 Hemp Trumpho</h1>
        <div className="flex gap-3 flex-wrap justify-center">
          <span className="bg-hemp-dark border border-hemp-gold/40 px-4 py-2 rounded-full text-sm text-hemp-gold">
            {({ rapido: '⚡ Rápido', medio: '🎯 Médio', completo: '🏆 Completo' })[modo]}
          </span>
          <span className="bg-hemp-dark border border-hemp-green/50 px-4 py-2 rounded-full text-sm">
            Rodada <strong className="text-hemp-gold">{partida.rodada}</strong>
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${ehMinhaVez ? 'bg-hemp-green text-white' : 'bg-hemp-purple text-white'}`}>
            {ehMinhaVez ? '🔥 Sua vez' : `⏳ ${partida.jogadores[partida.turnoAtual].nome}`}
          </span>
        </div>
      </div>

      {/* ÁREA DE JOGO - RESPONSIVO */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 lg:gap-12 mb-8">

        {/* JOGADOR */}
        <div className="flex flex-col items-center order-1">
          <div className="mb-3 text-center">
            <p className="font-bold text-hemp-gold text-lg">{jogadorHumano?.nome}</p>
            <p className="text-sm text-gray-400">🃏 {jogadorHumano?.cartas.length} cartas</p>
          </div>
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hemp-gold text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              SUA CARTA
            </div>
            {cartaHumano && (
              <CartaVisual
                carta={cartaHumano}
                virada={true}
                onEscolher={jogar}
                podeEscolher={ehMinhaVez && !revelado && !cartaHumanoEspecial}
                ehMinhaVez={ehMinhaVez && !revelado}
                atributoSelecionado={atributoSelecionado}
                foto={cartaHumano.tipo === 'genetica' ? `/cartas/fotos/${cartaHumano.id.toLowerCase()}.webp` : undefined}
              />
            )}
          </div>
        </div>

        {/* CENTRO: VS / resultado / controle de ritmo */}
        <div className="flex flex-col items-center justify-center lg:pt-32 order-2 min-w-[12rem]">
          {revelado ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <p className="text-lg font-bold text-hemp-gold">{resultadoTexto}</p>
              <p className="text-xs text-gray-300 max-w-[12rem]">{resultadoPendente?.mensagem}</p>
              <motion.button
                onClick={avancar}
                className="px-6 py-3 bg-hemp-gold hover:bg-yellow-400 text-black rounded-xl text-base font-bold transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                autoFocus
              >
                {ehUltimaRodada ? '🏆 Ver Resultado Final' : '▶ Próxima Rodada'}
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold text-hemp-gold">VS</div>
              {ehMinhaVez
                ? (cartaHumanoEspecial
                    ? <p className="text-xs text-hemp-gold animate-pulse text-center max-w-[12rem]">✨ Carta especial! Resolvendo…</p>
                    : <p className="text-xs text-gray-400 text-center max-w-[12rem]">Escolha um atributo na sua carta</p>)
                : <p className="text-xs text-gray-400 animate-pulse">⏳ Oponente está jogando...</p>}
            </div>
          )}
        </div>

        {/* IA */}
        <div className="flex flex-col items-center order-3">
          <div className="mb-3 text-center">
            <p className="font-bold text-gray-400 text-lg">{jogadorIA?.nome}</p>
            <p className="text-sm text-gray-500">🃏 {jogadorIA?.cartas.length} cartas</p>
          </div>
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              OPONENTE
            </div>
            {cartaIA && (
              <CartaVisual
                carta={cartaIA}
                virada={revelado}
                podeEscolher={false}
                atributoSelecionado={revelado ? atributoSelecionado : null}
                foto={cartaIA.tipo === 'genetica' ? `/cartas/fotos/${cartaIA.id.toLowerCase()}.webp` : undefined}
              />
            )}
          </div>
        </div>
      </div>

      {/* PLACAR DE RODADAS */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-center gap-3 sm:gap-4 bg-hemp-dark/80 border border-hemp-gold/20 rounded-xl p-3">
        <span className="flex items-center gap-1 font-bold text-green-400 text-sm sm:text-base">🌿 Você</span>
        <motion.span
          key={`vh-${vitoriasHumano}`}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`text-2xl font-extrabold ${humanoLidera ? 'text-hemp-gold' : 'text-gray-300'}`}
        >
          {vitoriasHumano}
        </motion.span>
        <span className="text-gray-500 font-bold">×</span>
        <motion.span
          key={`vo-${vitoriasOponente}`}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`text-2xl font-extrabold ${oponenteLidera ? 'text-hemp-gold' : 'text-gray-300'}`}
        >
          {vitoriasOponente}
        </motion.span>
        <span className="flex items-center gap-1 font-bold text-red-400 text-sm sm:text-base">Oponente 🤖</span>
        {empates > 0 && (
          <span className="text-xs text-gray-500 ml-1">· {empates} empate{empates > 1 ? 's' : ''}</span>
        )}
      </div>

      {/* BARRA DE CARTAS (proporção do baralho) */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-green-400 font-semibold">🃏 Você · {cartasHumano}</span>
          {monte > 0 && <span className="text-hemp-gold">Monte · {monte}</span>}
          <span className="text-red-400 font-semibold">{cartasOponente} · Oponente 🃏</span>
        </div>
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-hemp-dark/60 border border-hemp-gold/20">
          <motion.div className="bg-green-500 h-full" animate={{ width: `${pctHumano}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          <motion.div className="bg-hemp-gold h-full" animate={{ width: `${pctMonte}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          <motion.div className="bg-red-500 h-full" animate={{ width: `${pctOponente}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
      </div>

      {/* INFO */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 mb-6">
        <div className="bg-hemp-dark/80 border border-hemp-green/30 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase">Monte de Empate</p>
          <p className="text-3xl font-bold text-hemp-gold">{partida.monteEmpate.length}</p>
        </div>
        <div className="bg-hemp-dark/80 border border-hemp-green/30 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase">Total no Jogo</p>
          <p className="text-3xl font-bold text-hemp-gold">{total}</p>
        </div>
      </div>

      {/* HISTÓRICO */}
      <div className="max-w-2xl mx-auto bg-hemp-dark/80 border border-hemp-gold/20 rounded-xl p-4">
        <h3 className="text-hemp-gold font-bold mb-3 text-sm uppercase">📜 Histórico</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {historicoRodadas.length === 0 && (
            <p className="text-xs text-gray-500 italic">Nenhuma rodada jogada ainda.</p>
          )}
          <AnimatePresence initial={false}>
            {historicoRodadas.slice(-6).map((r, i) => {
              const quemJogou = r.jogadorId === jogadorHumano?.id ? 'Você' : 'Oponente'
              const cor = r.resultado === 'vitoria' ? 'text-green-400 border-green-400/50'
                : r.resultado === 'derrota' ? 'text-red-400 border-red-400/50'
                : 'text-gray-400 border-gray-400/40'
              const label = r.resultado === 'vitoria' ? 'Você venceu'
                : r.resultado === 'derrota' ? 'Oponente venceu'
                : 'Empate'
              return (
                <motion.div
                  key={`rodada-${r.rodada}`}
                  className={`border-l-2 pl-3 py-1 ${cor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-400">Rodada {r.rodada} · {quemJogou} jogou</span>
                    {r.atributo === 'ESPECIAL' ? (
                      <span className="flex items-center gap-1 font-semibold text-hemp-gold">
                        <span>⭐</span>ESPECIAL
                      </span>
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
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Confetti() {
  const [pieces, setPieces] = useState<number[]>([])

  useEffect(() => {
    const p = Array.from({ length: 50 }, (_, i) => i)
    setPieces(p)
  }, [])

  const colors = ['#c9a227', '#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6']

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${5 + Math.random() * 10}px`,
            height: `${5 + Math.random() * 10}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}
