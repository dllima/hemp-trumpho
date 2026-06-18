# Script: atualizar-visual.ps1
# Rode no PowerShell: .\atualizar-visual.ps1

Write-Host "🌿 Atualizando visual do Hemp Trumpho..." -ForegroundColor Green

$base = "D:\projetos\hemp-Trumpho"
$web = "$base\packages\web"

# 1. Matar processo do Vite se rodando
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*vite*" 
} | Stop-Process -Force

# 2. Limpar cache
Remove-Item -Path "$web\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Criar diretórios
New-Item -ItemType Directory -Path "$web\src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "$web\src\design-system" -Force | Out-Null
New-Item -ItemType Directory -Path "$web\src\hooks" -Force | Out-Null
New-Item -ItemType Directory -Path "$web\src\store" -Force | Out-Null

# 4. Deletar arquivos antigos que dão conflito
Remove-Item -Path "$web\tailwind.config.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\postcss.config.js" -Force -ErrorAction SilentlyContinue

# 5. Criar tailwind.config.cjs
@'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hemp-dark': '#1a3c1a',
        'hemp-green': '#2d5a2d',
        'hemp-light': '#4a7c4a',
        'hemp-gold': '#c9a227',
        'hemp-purple': '#6b2d5c',
        'hemp-red': '#8b1a1a',
      }
    },
  },
  plugins: [],
}
'@ | Set-Content -Path "$web\tailwind.config.cjs" -Encoding UTF8

# 6. Criar postcss.config.cjs
@'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Set-Content -Path "$web\postcss.config.cjs" -Encoding UTF8

# 7. Criar index.css
@'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-hemp-dark text-white;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .perspective-1000 {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
}
'@ | Set-Content -Path "$web\src\index.css" -Encoding UTF8

# 8. Criar Carta.tsx (VERTICAL, com verso)
@'
import { motion } from 'framer-motion'
import type { Carta as CartaType, CartaGenetica, Atributo } from '@hemp-Trumpho/engine'

const icones: Record<Atributo, string> = {
  thc: '🍃', cbd: '🍃', relaxamento: '🧘', foco: '👁️', 
  felicidade: '😊', fome: '🍴', sono: '😴'
}

const nomes: Record<Atributo, string> = {
  thc: 'THC', cbd: 'CBD', relaxamento: 'RELAXAMENTO', foco: 'FOCO',
  felicidade: 'FELICIDADE', fome: 'FOME', sono: 'SONO'
}

interface Props {
  carta: CartaType
  virada: boolean
  onEscolher?: (a: Atributo) => void
  podeEscolher?: boolean
}

export function CartaVisual({ carta, virada, onEscolher, podeEscolher }: Props) {
  if (carta.tipo === 'vantagem') {
    return (
      <div className="w-64 h-96 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-3xl font-bold text-white">VANTAGEM</h2>
        <p className="text-yellow-100 mt-2">Vitória automática!</p>
      </div>
    )
  }

  if (carta.tipo === 'reves') {
    return (
      <div className="w-64 h-96 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 shadow-2xl border-2 border-red-500 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold text-white">REVÉS</h2>
        <p className="text-red-100 mt-2">Derrota automática!</p>
      </div>
    )
  }

  const g = carta as CartaGenetica
  const attrs: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

  return (
    <div className="relative w-64 h-96 perspective-1000">
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: virada ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRENTE */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-hemp-green to-hemp-dark rounded-2xl p-4 shadow-2xl border border-hemp-gold flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-hemp-gold font-bold">{g.id}</span>
            <span className="text-xs bg-hemp-purple px-2 py-1 rounded text-white">{g.banco}</span>
          </div>

          <div className="h-16 bg-hemp-dark/80 rounded-xl mb-2 flex items-center justify-center text-4xl">
            🌿
          </div>

          <h3 className="text-hemp-gold font-bold text-sm mb-1">{g.nome}</h3>
          <p className="text-xs text-gray-300 mb-2 line-clamp-2">{g.descricao}</p>

          <div className="flex-1 flex flex-col gap-1">
            {attrs.map(attr => (
              <button
                key={attr}
                onClick={() => podeEscolher && onEscolher?.(attr)}
                disabled={!podeEscolher}
                className={`
                  flex justify-between items-center px-2 py-1 rounded text-xs transition-all
                  ${podeEscolher 
                    ? 'hover:bg-hemp-light cursor-pointer bg-hemp-dark/60 hover:scale-105' 
                    : 'cursor-default bg-hemp-dark/30 opacity-50'
                  }
                `}
              >
                <span className="flex items-center gap-1">
                  <span>{icones[attr]}</span>
                  <span className="uppercase">{nomes[attr]}</span>
                </span>
                <span className="font-bold text-hemp-gold">
                  {attr === 'thc' || attr === 'cbd' ? `${g[attr]}%` : g[attr]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* VERSO */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-hemp-purple to-black flex items-center justify-center border-2 border-hemp-gold/40"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="text-center">
            <div className="text-7xl mb-4">🌿</div>
            <p className="text-hemp-gold font-bold text-xl tracking-widest">HEMP</p>
            <p className="text-hemp-gold font-bold text-xl tracking-widest">Trumpho</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
'@ | Set-Content -Path "$web\src\components\Carta.tsx" -Encoding UTF8

# 9. Criar Mesa.tsx (LAYOUT HORIZONTAL)
@'
import { usePartida } from '../hooks/usePartida'
import { useIA } from '../hooks/useIA'
import { CartaVisual } from './Carta'
import { motion, AnimatePresence } from 'framer-motion'

export function Mesa() {
  const { partida, iniciar, jogar, jogadorHumano, jogadorIA, ehMinhaVez, cartaHumano, cartaIA } = usePartida()
  useIA(1500)

  if (!partida) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black">
        <div className="text-center">
          <motion.h1 className="text-5xl font-bold text-hemp-gold mb-4" initial={{opacity:0}} animate={{opacity:1}}>
            🌿 Hemp Trumpho
          </motion.h1>
          <p className="text-gray-400 mb-8">O jogo de cartas das genéticas</p>
          <button onClick={() => iniciar(['Você', 'Computador'])} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white transition-all hover:scale-105">
            ▶ Iniciar Partida
          </button>
        </div>
      </div>
    )
  }

  if (partida.finalizada) {
    const v = partida.jogadores.find(j => j.id === partida.vencedor)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hemp-dark to-black">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-hemp-gold mb-4">🏆 Fim de Jogo!</h1>
          <p className="text-3xl mb-2">{v?.nome} venceu!</p>
          <p className="text-gray-400 mb-8">Rodadas: {partida.rodada - 1}</p>
          <button onClick={() => iniciar(['Você', 'Computador'])} className="px-8 py-4 bg-hemp-green hover:bg-hemp-light rounded-xl text-xl font-bold text-white">
            🔄 Jogar Novamente
          </button>
        </div>
      </div>
    )
  }

  const total = (jogadorHumano?.cartas.length ?? 0) + (jogadorIA?.cartas.length ?? 0) + partida.monteEmpate.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-hemp-dark to-black p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-hemp-gold">🌿 Hemp Trumpho</h1>
        <div className="flex gap-3">
          <span className="bg-hemp-dark border border-hemp-green/50 px-4 py-2 rounded-full text-sm">
            Rodada <strong className="text-hemp-gold">{partida.rodada}</strong>
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${ehMinhaVez ? 'bg-hemp-green text-white' : 'bg-hemp-purple text-white'}`}>
            {ehMinhaVez ? '🔥 Sua vez' : `⏳ ${partida.jogadores[partida.turnoAtual].nome}`}
          </span>
        </div>
      </div>

      {/* ÁREA DE JOGO - LADO A LADO */}
      <div className="flex justify-center items-start gap-8 md:gap-16 mb-8">

        {/* JOGADOR */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center">
            <p className="font-bold text-hemp-gold text-lg">{jogadorHumano?.nome}</p>
            <p className="text-sm text-gray-400">{jogadorHumano?.cartas.length} cartas</p>
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
                podeEscolher={ehMinhaVez}
              />
            )}
          </div>
          {!ehMinhaVez && <p className="mt-3 text-sm text-gray-400 animate-pulse">⏳ Aguardando...</p>}
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center pt-24">
          <div className="text-4xl font-bold text-hemp-gold">VS</div>
        </div>

        {/* IA */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center">
            <p className="font-bold text-gray-400 text-lg">{jogadorIA?.nome}</p>
            <p className="text-sm text-gray-500">{jogadorIA?.cartas.length} cartas</p>
          </div>
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              OPONENTE
            </div>
            {cartaIA && (
              <CartaVisual 
                carta={cartaIA} 
                virada={!ehMinhaVez}  // VERSO quando não é turno da IA
              />
            )}
          </div>
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
        <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
          <AnimatePresence>
            {partida.historico.slice(-6).map((h, i) => (
              <motion.p key={i} className="text-gray-300 border-l-2 border-hemp-gold/30 pl-3"
                initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:i*0.05}}>
                {h}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
'@ | Set-Content -Path "$web\src\components\Mesa.tsx" -Encoding UTF8

# 10. Criar hooks
@'
import { useCallback } from 'react'
import { useJogoStore } from '../store/jogoStore'
import { type Atributo } from '@hemp-Trumpho/engine'

export function usePartida() {
  const { partida, iniciarPartida, jogarAtributo } = useJogoStore()

  const iniciar = useCallback((nomes: string[]) => iniciarPartida(nomes), [iniciarPartida])
  const jogar = useCallback((a: Atributo) => jogarAtributo(a), [jogarAtributo])

  return {
    partida,
    iniciar,
    jogar,
    jogadorHumano: partida?.jogadores[0] ?? null,
    jogadorIA: partida?.jogadores[1] ?? null,
    ehMinhaVez: partida?.turnoAtual === 0,
    cartaHumano: partida?.jogadores[0]?.cartas[0] ?? null,
    cartaIA: partida?.jogadores[1]?.cartas[0] ?? null,
  }
}
'@ | Set-Content -Path "$web\src\hooks\usePartida.ts" -Encoding UTF8

@'
import { useEffect, useCallback } from 'react'
import { useJogoStore } from '../store/jogoStore'
import { type Atributo } from '@hemp-Trumpho/engine'

const ATRIBUTOS: Atributo[] = ['thc', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

export function useIA(delayMs = 1500) {
  const { partida, jogarAtributo } = useJogoStore()

  const escolher = useCallback(() => ATRIBUTOS[Math.floor(Math.random() * ATRIBUTOS.length)], [])

  useEffect(() => {
    if (!partida || partida.finalizada || partida.turnoAtual !== 1) return
    const timer = setTimeout(() => jogarAtributo(escolher()), delayMs)
    return () => clearTimeout(timer)
  }, [partida, jogarAtributo, escolher, delayMs])
}
'@ | Set-Content -Path "$web\src\hooks\useIA.ts" -Encoding UTF8

# 11. Criar index.ts dos hooks
@'export { usePartida } from './usePartida'
export { useIA } from './useIA'
'@ | Set-Content -Path "$web\src\hooks\index.ts" -Encoding UTF8

# 12. Deletar arquivos antigos que podem dar conflito
Remove-Item -Path "$web\src\components\Placar.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\components\AreaJogador.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\components\InfoBar.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\components\Historico.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\components\TelaInicial.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\components\TelaFimJogo.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$web\src\design-system" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Arquivos atualizados!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora rode:" -ForegroundColor Yellow
Write-Host "  cd D:\projetos\hemp-Trumpho" -ForegroundColor White
Write-Host "  npm run build:engine" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Acesse http://localhost:5173" -ForegroundColor Cyan
