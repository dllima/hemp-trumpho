import type { Atributo } from '@hemp-trunfo/engine'

// Mapas de apresentação dos atributos das cartas (emoji, rótulo e cor Tailwind).
// Compartilhados entre Carta.tsx e o histórico (Mesa.tsx).

export const icones: Record<Atributo, string> = {
  thc: '🍃', cbd: '🍃', relaxamento: '🧘', foco: '👁️',
  felicidade: '😊', fome: '🍴', sono: '😴'
}

export const nomes: Record<Atributo, string> = {
  thc: 'THC', cbd: 'CBD', relaxamento: 'RELAXAMENTO', foco: 'FOCO',
  felicidade: 'FELICIDADE', fome: 'FOME', sono: 'SONO'
}

export const coresAtributo: Record<Atributo, string> = {
  thc: 'text-green-400',
  cbd: 'text-blue-400',
  relaxamento: 'text-purple-400',
  foco: 'text-cyan-400',
  felicidade: 'text-yellow-400',
  fome: 'text-red-400',
  sono: 'text-indigo-400'
}
