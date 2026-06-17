import { useEffect } from 'react'
import { useJogoStore } from '../store/jogoStore'
import { CartaVisual } from './Carta'
import { motion, AnimatePresence } from 'framer-motion'

export function Mesa() {
  const { partida, iniciarPartida, jogarAtributo } = useJogoStore()

  useEffect(() => {
    if (!partida || partida.finalizada) return
    if (partida.turnoAtual !== 1) return

    const timer = setTimeout(() => {
      const atributos = ['thc', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono'] as const
      const atributo = atributos[Math.floor(Math.random() * atributos.length)]
      jogarAtributo(atributo)
    }, 1500)

    return () => clearTimeout(timer)
  }, [partida, jogarAtributo])

  if (!partida) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black">
        <div className="text-center">
          <motion.h1 
            className="text-5xl font-bold text-hemp-gold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌿 Hemp Trunfo
          </motion.h1>
          <p className="text-gray-400 mb-8">O jogo de cartas das genéticas</p>
          <motion.button 
            onClick={() => iniciarPartida(['Você', 'Computador'])}
            className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ▶ Iniciar Partida
          </motion.button>
        </div>
      </div>
    )
  }

  if (partida.finalizada) {
    const vencedor = partida.jogadores.find(j => j.id === partida.vencedor)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black">
        <motion.div 
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <h1 className="text-6xl font-bold text-hemp-gold mb-4">🏆 Fim de Jogo!</h1>
          <p className="text-3xl mb-2">{vencedor?.nome} venceu!</p>
          <p className="text-gray-400 mb-8">Rodadas jogadas: {partida.rodada - 1}</p>
          <button 
            onClick={() => iniciarPartida(['Você', 'Computador'])}
            className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold transition-colors"
          >
            🔄 Jogar Novamente
          </button>
        </motion.div>
      </div>
    )
  }

  const jogadorHumano = partida.jogadores[0]
  const jogadorIA = partida.jogadores[1]
  const cartaHumano = jogadorHumano.cartas[0]
  const cartaIA = jogadorIA.cartas[0]
  const ehMinhaVez = partida.turnoAtual === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-hemp-dark to-black p-4">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-hemp-gold">🌿 Hemp Trunfo</h1>
        <div className="text-sm flex gap-4">
          <span className="bg-hemp-dark px-3 py-1 rounded-full">Rodada: {partida.rodada}</span>
          <span className={`px-3 py-1 rounded-full ${ehMinhaVez ? 'bg-hemp-green' : 'bg-hemp-purple'}`}>
            Turno: {partida.jogadores[partida.turnoAtual].nome}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 md:gap-16 mb-6 flex-wrap">
        <div className="text-center">
          <p className="mb-3 font-bold text-hemp-gold">
            {jogadorHumano.nome} 
            <span className="ml-2 text-sm bg-hemp-dark px-2 py-1 rounded-full">
              {jogadorHumano.cartas.length} cartas
            </span>
          </p>
          {cartaHumano && (
            <CartaVisual 
              carta={cartaHumano} 
              virada={true}
              onEscolherAtributo={jogarAtributo}
              podeEscolher={ehMinhaVez}
            />
          )}
          {!ehMinhaVez && <p className="mt-2 text-sm text-gray-400">Aguardando oponente...</p>}
        </div>

        <div className="text-4xl font-bold text-hemp-gold">VS</div>

        <div className="text-center">
          <p className="mb-3 font-bold text-gray-400">
            {jogadorIA.nome}
            <span className="ml-2 text-sm bg-hemp-dark px-2 py-1 rounded-full">
              {jogadorIA.cartas.length} cartas
            </span>
          </p>
          {cartaIA && (
            <CartaVisual 
              carta={cartaIA} 
              virada={ehMinhaVez}
            />
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 mb-4">
        <div className="bg-hemp-dark/50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">Monte de Empate</p>
          <p className="text-2xl font-bold text-hemp-gold">{partida.monteEmpate.length}</p>
        </div>
        <div className="bg-hemp-dark/50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">Total no Jogo</p>
          <p className="text-2xl font-bold text-hemp-gold">
            {jogadorHumano.cartas.length + jogadorIA.cartas.length + partida.monteEmpate.length}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-hemp-dark/50 rounded-xl p-4">
        <h3 className="text-hemp-gold font-bold mb-2 text-sm">📜 Últimas rodadas</h3>
        <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
          <AnimatePresence>
            {partida.historico.slice(-5).map((h, i) => (
              <motion.p 
                key={i} 
                className="text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {h}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
