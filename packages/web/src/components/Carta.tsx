import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Carta as CartaType, CartaGenetica, Atributo } from '@hemp-trunfo/engine'
import { CartaVerso } from './CartaVerso'
import { icones, nomes, coresAtributo } from '../utils/atributos'

interface Props {
  carta: CartaType
  virada: boolean
  onEscolher?: (a: Atributo) => void
  podeEscolher?: boolean
  ehMinhaVez?: boolean
  atributoSelecionado?: Atributo | null
  /** Caminho da foto da strain (ex.: "/cartas/fotos/A1.webp"). Sem isso, mostra placeholder. */
  foto?: string
}

// Ícone do atributo: usa o SVG em /cartas/icones/<attr>.svg quando existir,
// e cai no emoji se o arquivo ainda não foi criado (onError).
function IconeAtributo({ attr }: { attr: Atributo }) {
  const [semSvg, setSemSvg] = useState(false)
  return (
    // Círculo dourado de fundo (#f7d515) com o ícone branco centralizado.
    <span className="w-6 h-6 shrink-0 rounded-full bg-[#f7d515] flex items-center justify-center">
      {semSvg ? (
        <span className="text-xs leading-none">{icones[attr]}</span>
      ) : (
        <img
          src={`/cartas/icones/${attr}.svg`}
          alt=""
          aria-hidden
          className="w-4 h-4"
          // SVGs têm fill escuro (#003d38); clareia p/ ícone branco no círculo.
          style={{ filter: 'brightness(0) invert(1)' }}
          onError={() => setSemSvg(true)}
        />
      )}
    </span>
  )
}

export function CartaVisual({ carta, virada, onEscolher, podeEscolher, ehMinhaVez, atributoSelecionado, foto }: Props) {

  // Cartas especiais (vantagem/revés) só são reveladas quando `virada` é true.
  // Enquanto não viradas mostram o verso, igual às genéticas — assim a carta
  // especial do oponente só aparece no momento da revelação da rodada.
  if (carta.tipo === 'vantagem' || carta.tipo === 'reves') {
    if (!virada) {
      return <CartaVerso tamanho="normal" />
    }
    if (carta.tipo === 'vantagem') {
      return (
        <motion.div
          className="w-56 h-[360px] sm:w-64 sm:h-96 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300 flex flex-col items-center justify-center text-center"
          initial={{ scale: 0.6 }}
          animate={{
            scale: [0.6, 1.15, 1],
            boxShadow: [
              '0 0 0px rgba(234,179,8,0)',
              '0 0 40px rgba(234,179,8,0.85)',
              '0 0 24px rgba(234,179,8,0.6)',
            ],
          }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], ease: 'easeOut' }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 12, -12, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⭐
          </motion.div>
          <h2 className="text-3xl font-bold text-white">VANTAGEM</h2>
          <p className="text-yellow-100 mt-2">Vitória automática!</p>
        </motion.div>
      )
    }
    return (
      <motion.div
        className="w-56 h-[360px] sm:w-64 sm:h-96 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 shadow-2xl border-2 border-red-500 flex flex-col items-center justify-center text-center"
        initial={{ x: 0 }}
        animate={{
          x: [0, -8, 8, -6, 6, -4, 4, 0],
          opacity: [1, 0.7, 1],
          boxShadow: [
            '0 0 0px rgba(0,0,0,0)',
            '0 0 40px rgba(139,26,26,0.9)',
            '0 0 18px rgba(0,0,0,0.5)',
          ],
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 0.95, 1], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          💀
        </motion.div>
        <h2 className="text-3xl font-bold text-white">REVÉS</h2>
        <p className="text-red-100 mt-2">Derrota automática!</p>
      </motion.div>
    )
  }

  const g = carta as CartaGenetica
  const attrs: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

  return (
    <div className={`relative w-56 h-[360px] sm:w-64 sm:h-96 perspective-1000 ${ehMinhaVez ? 'animate-pulse-gold' : ''}`}>
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: virada ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRENTE */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl p-4 shadow-2xl border-2 flex flex-col ${ehMinhaVez ? 'border-hemp-gold' : 'border-hemp-gold/30'}`}
          // Camadas (topo→base): overlay verde p/ legibilidade do texto, pattern
          // da carta e, por fim, o gradiente verde — fallback caso o pattern 404.
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(26,60,26,0.6), rgba(26,60,26,0.72)), " +
              "url('/cartas/bg/pattern.webp'), " +
              "linear-gradient(to bottom right, #2d5a2d, #1a3c1a)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-hemp-gold font-bold">{g.id}</span>
            <span className="text-xs bg-hemp-purple px-2 py-1 rounded text-white">{g.banco}</span>
          </div>

          {/* Foto da strain — placeholder verde enquanto o asset não existe */}
          {foto ? (
            <img
              src={foto}
              alt={g.nome}
              className="w-full h-24 sm:h-32 object-cover rounded-xl mb-2"
            />
          ) : (
            <div className="h-24 sm:h-32 bg-gradient-to-br from-hemp-green to-hemp-dark rounded-xl mb-2 flex items-center justify-center text-4xl">
              🌿
            </div>
          )}

          <h3 className="text-hemp-gold font-bold text-sm mb-1">{g.nome}</h3>
          <p className="text-xs text-gray-300 mb-2 line-clamp-2">{g.descricao}</p>

          <div className="flex-1 flex flex-col gap-1">
            {attrs.map(attr => (
              <button
                key={attr}
                onClick={() => podeEscolher && onEscolher?.(attr)}
                disabled={!podeEscolher}
                className={`
                  flex justify-between items-center px-2 py-2 md:py-1 rounded text-sm md:text-xs transition-all
                  ${podeEscolher 
                    ? 'hover:bg-hemp-light cursor-pointer bg-hemp-dark/60 hover:scale-105' 
                    : 'cursor-default bg-hemp-dark/30 opacity-50'
                  }
                  ${atributoSelecionado === attr ? 'ring-2 ring-hemp-gold bg-hemp-gold/20' : ''}
                `}
              >
                <span className={`flex items-center gap-2 ${coresAtributo[attr]}`}>
                  <IconeAtributo attr={attr} />
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
        <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
          <CartaVerso tamanho="normal" />
        </div>
      </motion.div>
    </div>
  )
}