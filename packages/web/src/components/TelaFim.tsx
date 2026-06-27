import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Confetti } from './Confetti'

// Pools separados de assets por desfecho, declarados no manifesto.
type Pool = { fotos: string[]; sons: string[] }
type Manifest = { vitoria: Pool; derrota: Pool }

interface Props {
  venceu: boolean
  nomeVencedor: string
  rodadas: number
  onJogarDeNovo: () => void
  onEscolherModo: () => void
}

// Sorteia um item do array (ou null se vazio). Chamado UMA vez na montagem.
function sortear<T>(arr: T[] | undefined): T | null {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

// Tela de fim de jogo (compartilhada desktop + mobile). Soma uma FOTO e um SOM
// aleatórios — pools próprios de vitória/derrota declarados em /fim/manifest.json.
// Degrada graciosamente: sem manifesto/asset, renderiza só troféu + texto + botões.
export function TelaFim({ venceu, nomeVencedor, rodadas, onJogarDeNovo, onEscolherModo }: Props) {
  const pasta = venceu ? 'vitoria' : 'derrota'
  // Foto/som sorteados na montagem e fixados em estado (não re-sorteia em re-render).
  const [foto, setFoto] = useState<string | null>(null)
  const [som, setSom] = useState<string | null>(null)

  // Carrega o manifesto, escolhe o pool do desfecho e sorteia 1 foto + 1 som.
  useEffect(() => {
    let cancelado = false
    fetch('/fim/manifest.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('manifesto ausente'))))
      .then((m: Manifest) => {
        if (cancelado) return
        const pool = m?.[pasta]
        const f = sortear(pool?.fotos)
        const s = sortear(pool?.sons)
        if (f) setFoto(`/fim/${pasta}/${f}`)
        if (s) setSom(`/fim/${pasta}/${s}`)
      })
      .catch(() => { /* sem manifesto/pool: degrada sem foto/som, sem quebrar */ })
    return () => { cancelado = true }
  }, [pasta])

  // Toca o som ao definir. Autoplay pode ser bloqueado pelo browser → o reject
  // da promise é engolido silenciosamente (sem erro visível, sem quebrar a tela).
  useEffect(() => {
    if (!som) return
    const audio = new Audio(som)
    audio.play().catch(() => { /* bloqueado pela autoplay policy: silencioso */ })
    return () => { audio.pause() }
  }, [som])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black relative overflow-hidden">
      {/* Confete só na vitória. */}
      {venceu && <Confetti />}
      <div className="text-center z-10 px-4">
        <motion.h1 className="text-6xl md:text-7xl font-bold text-hemp-gold mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          🏆 Fim de Jogo!
        </motion.h1>
        <p className="text-3xl md:text-4xl mb-2">{nomeVencedor} venceu!</p>

        {/* Foto sorteada SOMA ao troféu+texto (não substitui). */}
        {foto && (
          <motion.img
            src={foto}
            alt=""
            className="mx-auto my-6 max-h-64 w-auto rounded-2xl shadow-2xl border-2 border-hemp-gold/40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onError={() => setFoto(null)}
          />
        )}

        <p className="text-gray-400 mb-8">Rodadas: {rodadas}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onJogarDeNovo} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white transition-all hover:scale-105">
            🔄 Jogar de novo
          </button>
          <button onClick={onEscolherModo} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white transition-all hover:scale-105">
            🎮 Escolher modo
          </button>
        </div>
      </div>
    </div>
  )
}
