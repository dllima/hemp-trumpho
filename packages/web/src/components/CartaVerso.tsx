import { motion } from 'framer-motion'

interface CartaVersoProps {
  tamanho?: 'normal' | 'pequeno'
}

// Verso da carta replicando o baralho físico: fundo verde radial, meio-tom e
// raios de sol em CSS, com o logo PNG real do baralho centralizado (glow
// dourado) e "RADIO HEMP" curvado na base.
// Cores fora do tema vêm de inline styles (Tailwind v4 — sem tailwind.config.js).
export function CartaVerso({ tamanho = 'normal' }: CartaVersoProps) {
  const dimensao = tamanho === 'pequeno' ? 'w-56 h-[340px]' : 'w-64 h-96'

  return (
    <div
      className={`${dimensao} relative rounded-2xl overflow-hidden shadow-2xl border-2 border-hemp-gold/60`}
      style={{ background: 'radial-gradient(circle at 50% 42%, #4ade80 0%, #22c55e 40%, #166534 100%)' }}
    >
      {/* MEIO-TOM (halftone dots) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#15803d 1.5px, transparent 1.6px)',
          backgroundSize: '10px 10px',
          opacity: 0.35,
        }}
      />

      {/* RAIOS DE SOL estilo HQ (conic-gradient), atrás do logo */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '135%',
          aspectRatio: '1',
          background:
            'repeating-conic-gradient(from 0deg at 50% 50%, rgba(190,242,100,0.40) 0deg 5deg, transparent 5deg 16deg)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* LOGO PNG real do baralho físico, centralizado com glow dourado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/logo-hemp-trumpho.png"
          alt="Hemp Trumpho"
          className="w-40 h-auto drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 0 15px rgba(234,179,8,0.6))' }}
        />
      </div>

      {/* Site oficial em linha reta na base */}
      <div
        className="absolute bottom-8 left-0 w-full text-center text-xs font-bold tracking-wider uppercase"
        style={{ color: '#4ade80' }}
      >
        www.radiohemp.com
      </div>

      {/* BRILHO sutil no topo (animação opcional) */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
