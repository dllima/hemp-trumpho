import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Carta as CartaType, CartaGenetica, Atributo } from '@hemp-trumpho/engine'
import { CartaVerso } from './CartaVerso'
import { icones, nomes } from '../utils/atributos'

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
    <span className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#f7d515] flex items-center justify-center shadow-md">
      {semSvg ? (
        <span className="text-base leading-none">{icones[attr]}</span>
      ) : (
        <img
          src={`/cartas/icones/${attr}.svg`}
          alt=""
          aria-hidden
          className="w-5 h-5 sm:w-6 sm:h-6"
          onError={() => setSemSvg(true)}
        />
      )}
    </span>
  )
}

// Carta especial (VANTAGEM/REVÉS) com a ARTE real ocupando a carta, mantendo
// a animação de entrada (glow dourado na VANTAGEM, tremor/flash na REVÉS).
// Fallback via máquina de fase webp → jpg → 'fallback' (visual antigo: emoji +
// título + subtítulo). Cada onError só AVANÇA a fase (sem loop).
function CartaEspecial({ tipo }: { tipo: 'vantagem' | 'reves' }) {
  const [fase, setFase] = useState<'webp' | 'jpg' | 'fallback'>('webp')
  const ehVantagem = tipo === 'vantagem'
  const base = `/cartas/especiais/${tipo.toLowerCase()}`
  const dim = 'relative overflow-hidden w-[240px] h-[400px] sm:w-[320px] sm:h-[540px] rounded-2xl shadow-2xl border-2'

  // Arte (webp/jpg) preenchendo a carta, ou o visual antigo no fallback.
  const conteudo = fase !== 'fallback' ? (
    <img
      src={fase === 'webp' ? `${base}.webp` : `${base}.jpg`}
      alt={ehVantagem ? 'VANTAGEM' : 'REVÉS'}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setFase(f => (f === 'webp' ? 'jpg' : 'fallback'))}
    />
  ) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
      <motion.div
        className="text-6xl mb-4"
        animate={ehVantagem ? { scale: [1, 1.3, 1], rotate: [0, 12, -12, 0] } : { scale: [1, 1.2, 0.95, 1], rotate: [0, -10, 10, 0] }}
        transition={ehVantagem ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6, ease: 'easeInOut' }}
      >
        {ehVantagem ? '⭐' : '💀'}
      </motion.div>
      <h2 className="text-3xl font-bold text-white">{ehVantagem ? 'VANTAGEM' : 'REVÉS'}</h2>
      <p className={`mt-2 ${ehVantagem ? 'text-yellow-100' : 'text-red-100'}`}>{ehVantagem ? 'Vence a rodada!' : 'Perde a rodada!'}</p>
    </div>
  )

  if (ehVantagem) {
    return (
      <motion.div
        className={`${dim} border-yellow-300 ${fase === 'fallback' ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700' : ''}`}
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
        {conteudo}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`${dim} border-red-500 ${fase === 'fallback' ? 'bg-gradient-to-br from-red-700 to-red-900' : ''}`}
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
      {conteudo}
    </motion.div>
  )
}

export function CartaVisual({ carta, virada, onEscolher, podeEscolher, ehMinhaVez, atributoSelecionado, foto }: Props) {

  // Fallback da foto da strain: webp → jpg → placeholder. Cada onError só
  // AVANÇA a fase, nunca reaponta para um src que já falhou (evita loop).
  // Declarado antes dos early returns das cartas especiais para respeitar as
  // Rules of Hooks (a carta pode alternar entre especial e genética).
  const [fotoFase, setFotoFase] = useState<'webp' | 'jpg' | 'erro'>('webp')
  // A instância de CartaVisual é reusada entre rodadas; reseta a fase ao
  // trocar de carta para não herdar um fallback de uma carta anterior.
  useEffect(() => { setFotoFase('webp') }, [foto])

  // Cartas especiais (vantagem/revés) só são reveladas quando `virada` é true.
  if (carta.tipo === 'vantagem' || carta.tipo === 'reves') {
    if (!virada) {
      return <CartaVerso tamanho="normal" />
    }
    return <CartaEspecial tipo={carta.tipo} />
  }

  const g = carta as CartaGenetica
  const attrs: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

  return (
    <div className={`relative w-[240px] h-[400px] sm:w-[320px] sm:h-[540px] perspective-1000 ${ehMinhaVez ? 'animate-pulse-gold' : ''}`}>
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: virada ? 0 : 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRENTE — visual da carta física original */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden ${ehMinhaVez ? 'border-[#f7d515]' : 'border-[#0a4d3c]'}`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(10,77,60,0.85), rgba(10,77,60,0.95)), " +
              "url('/cartas/bg/pattern.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0a4d3c',
          }}
        >
          {/* ÁREA SUPERIOR: Foto + Badges (~30% da altura) */}
          <div className="relative w-full h-[30%] shrink-0">
            {foto && fotoFase !== 'erro' ? (
              <img
                // fase 'webp' usa o caminho recebido; 'jpg' troca a extensão.
                src={fotoFase === 'webp' ? foto : foto.replace(/\.webp$/, '.jpg')}
                alt={g.nome}
                className="w-full h-full object-cover"
                onError={() => setFotoFase(f => (f === 'webp' ? 'jpg' : 'erro'))}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a5a1a] to-[#0a3a0a] flex items-center justify-center">
                <span className="text-5xl sm:text-6xl">🌿</span>
              </div>
            )}

            {/* Badge código (canto superior esquerdo) */}
            <div className="absolute top-2 left-2 bg-[#4ade80] text-[#0a4d3c] font-extrabold text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg">
              {g.id}
            </div>

            {/* Badge banco (canto superior direito) */}
            <div className="absolute top-2 right-2 bg-[#4ade80] text-[#0a4d3c] font-bold text-[9px] sm:text-[10px] px-2 py-1 rounded-lg shadow-lg">
              {g.banco}
            </div>
          </div>

          {/* ÁREA DO NOME */}
          <div className="px-3 pt-2 pb-1 text-center shrink-0">
            <h3 className="text-[#f7d515] font-black text-sm sm:text-base uppercase tracking-wide leading-tight">
              {g.nome}
            </h3>
          </div>

          {/* DESCRIÇÃO */}
          <div className="px-3 pb-2 text-center shrink-0">
            <p className="text-[9px] sm:text-[10px] text-gray-300 leading-snug line-clamp-2">
              {g.descricao}
            </p>
          </div>

          {/* ATRIBUTOS — linhas horizontais com contorno reforçado e hover glow */}
          <div className="flex-1 flex flex-col gap-[4px] sm:gap-[6px] px-3 pb-3 overflow-hidden">
            {attrs.map(attr => (
              <button
                key={attr}
                onClick={() => podeEscolher && onEscolher?.(attr)}
                disabled={!podeEscolher}
                className={`
                  group relative flex items-center h-8 sm:h-9 rounded-lg transition-all duration-300
                  border-2 border-[#0a4d3c] shadow-sm
                  ${podeEscolher 
                    ? 'hover:scale-[1.05] hover:shadow-xl hover:border-[#f7d515] cursor-pointer hover:-translate-y-0.5' 
                    : 'cursor-default opacity-80'
                  }
                  ${atributoSelecionado === attr ? 'ring-2 ring-[#f7d515] shadow-xl border-[#f7d515]' : 'bg-white/95'}
                `}
              >
                {/* Fundo branco da linha */}
                <div className="absolute inset-0 bg-white/95 rounded-lg" />

                {/* Efeito hover — glow dourado estático */}
                <div className={`
                  absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
                  ${podeEscolher ? 'group-hover:opacity-100' : ''}
                  bg-[#f7d515]/20
                `} />

                {/* Ícone posicionado à esquerda */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20">
                  <IconeAtributo attr={attr} />
                </div>

                {/* Nome do atributo */}
                <span className="relative z-10 font-bold text-[#0a4d3c] uppercase tracking-wide text-[10px] sm:text-[11px] ml-7 sm:ml-8">
                  {nomes[attr]}
                </span>

                {/* VALOR — largura fixa, fundo escuro, letra clara */}
                <div className={`
                  relative z-10 ml-auto flex items-center justify-center
                  h-full w-14 sm:w-16 rounded-r-md
                  bg-[#0a4d3c] text-[#f7d515]
                  ${atributoSelecionado === attr ? 'bg-[#0a4d3c]' : ''}
                  ${podeEscolher ? 'group-hover:bg-[#06362a] group-hover:text-white group-hover:shadow-inner' : ''}
                  transition-colors duration-300
                `}>
                  <span className="font-black text-xs sm:text-sm">
                    {attr === 'thc' || attr === 'cbd' ? `${g[attr]}%` : g[attr]}
                  </span>
                </div>
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
