import { motion } from 'framer-motion'
import type { Carta as CartaType, CartaGenetica, Atributo } from '@hemp-trunfo/engine'

const iconesAtributos: Record<Atributo, string> = {
  thc: '🍃',
  cbd: '🍃',
  relaxamento: '🧘',
  foco: '👁️',
  felicidade: '😊',
  fome: '🍴',
  sono: '😴'
}

const nomesAtributos: Record<Atributo, string> = {
  thc: 'NÍVEL DE THC',
  cbd: 'NÍVEL DE CBD',
  relaxamento: 'RELAXAMENTO',
  foco: 'FOCO',
  felicidade: 'FELICIDADE',
  fome: 'FOME',
  sono: 'SONO'
}

interface CartaProps {
  carta: CartaType
  virada: boolean
  onEscolherAtributo?: (atributo: Atributo) => void
  podeEscolher?: boolean
}

export function CartaVisual({ carta, virada, onEscolherAtributo, podeEscolher }: CartaProps) {
  if (carta.tipo === 'vantagem') {
    return (
      <div className="w-64 h-96 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl p-4 shadow-2xl border-2 border-yellow-300">
        <div className="text-center h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">⭐ VANTAGEM</h2>
          <p className="text-lg">Você vence esta rodada automaticamente!</p>
        </div>
      </div>
    )
  }

  if (carta.tipo === 'reves') {
    return (
      <div className="w-64 h-96 bg-gradient-to-br from-red-700 to-red-900 rounded-xl p-4 shadow-2xl border-2 border-red-500">
        <div className="text-center h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">💀 REVÉS</h2>
          <p className="text-lg">Você perde esta rodada automaticamente!</p>
        </div>
      </div>
    )
  }

  const genetica = carta as CartaGenetica
  const atributos: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

  return (
    <div className="relative w-72 h-[28rem] perspective-1000">
      <motion.div 
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: virada ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-hemp-green to-hemp-dark rounded-xl p-4 shadow-2xl border border-hemp-gold">
          <div className="flex justify-between items-start mb-2">
            <span className="text-hemp-gold font-bold text-lg">{genetica.id}</span>
            <span className="text-xs bg-hemp-purple px-2 py-1 rounded">{genetica.banco}</span>
          </div>

          <div className="h-24 bg-hemp-dark rounded-lg mb-3 flex items-center justify-center text-4xl">
            🌿
          </div>

          <h3 className="text-hemp-gold font-bold text-lg mb-1 leading-tight">{genetica.nome}</h3>
          <p className="text-xs text-gray-300 mb-3 line-clamp-2">{genetica.descricao}</p>

          <div className="space-y-1">
            {atributos.map(attr => (
              <button
                key={attr}
                onClick={() => podeEscolher && onEscolherAtributo?.(attr)}
                disabled={!podeEscolher}
                className={`w-full flex justify-between items-center px-2 py-1 rounded text-sm transition-colors
                  ${podeEscolher 
                    ? 'hover:bg-hemp-light cursor-pointer bg-hemp-dark/50' 
                    : 'cursor-default bg-hemp-dark/30'
                  }`}
              >
                <span className="text-xs">{iconesAtributos[attr]} {nomesAtributos[attr]}</span>
                <span className="font-bold text-hemp-gold">
                  {attr === 'thc' || attr === 'cbd' ? `${genetica[attr]}%` : genetica[attr]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-hemp-purple to-hemp-dark flex items-center justify-center border border-hemp-gold/30"
             style={{ transform: 'rotateY(180deg)' }}>
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-hemp-gold font-bold">HEMP TRUNFO</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
