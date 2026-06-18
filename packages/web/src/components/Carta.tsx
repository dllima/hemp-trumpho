import { motion } from 'framer-motion'
import type { Carta as CartaType, CartaGenetica, Atributo } from '@hemp-trunfo/engine'
import { CartaVerso } from './CartaVerso'

const icones: Record<Atributo, string> = {
  thc: '🍃', cbd: '🍃', relaxamento: '🧘', foco: '👁️', 
  felicidade: '😊', fome: '🍴', sono: '😴'
}

const nomes: Record<Atributo, string> = {
  thc: 'THC', cbd: 'CBD', relaxamento: 'RELAXAMENTO', foco: 'FOCO',
  felicidade: 'FELICIDADE', fome: 'FOME', sono: 'SONO'
}

const coresAtributo: Record<Atributo, string> = {
  thc: 'text-green-400',
  cbd: 'text-blue-400',
  relaxamento: 'text-purple-400',
  foco: 'text-cyan-400',
  felicidade: 'text-yellow-400',
  fome: 'text-red-400',
  sono: 'text-indigo-400'
}

interface Props {
  carta: CartaType
  virada: boolean
  onEscolher?: (a: Atributo) => void
  podeEscolher?: boolean
  ehMinhaVez?: boolean
  atributoSelecionado?: Atributo | null
}

export function CartaVisual({ carta, virada, onEscolher, podeEscolher, ehMinhaVez, atributoSelecionado }: Props) {

  // Cartas especiais (vantagem/revés) só são reveladas quando `virada` é true.
  // Enquanto não viradas mostram o verso, igual às genéticas — assim a carta
  // especial do oponente só aparece no momento da revelação da rodada.
  if (carta.tipo === 'vantagem' || carta.tipo === 'reves') {
    if (!virada) {
      return <CartaVerso tamanho="normal" />
    }
    if (carta.tipo === 'vantagem') {
      return (
        <div className="w-64 h-96 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-3xl font-bold text-white">VANTAGEM</h2>
          <p className="text-yellow-100 mt-2">Vitória automática!</p>
        </div>
      )
    }
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
    <div className={`relative w-64 h-96 perspective-1000 ${ehMinhaVez ? 'animate-pulse-gold' : ''}`}>
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: virada ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRENTE */}
        <div className={`absolute inset-0 backface-hidden bg-gradient-to-br from-hemp-green to-hemp-dark rounded-2xl p-4 shadow-2xl border-2 flex flex-col ${ehMinhaVez ? 'border-hemp-gold' : 'border-hemp-gold/30'}`}>
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
                  ${atributoSelecionado === attr ? 'ring-2 ring-hemp-gold bg-hemp-gold/20' : ''}
                `}
              >
                <span className={`flex items-center gap-1 ${coresAtributo[attr]}`}>
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
        <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
          <CartaVerso tamanho="normal" />
        </div>
      </motion.div>
    </div>
  )
}