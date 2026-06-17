import { create } from 'zustand'
import { 
  criarPartida, 
  escolherAtributo, 
  baralhoCompleto,
  obterCartaTopo,
  podeEscolherAtributo,
  type EstadoPartida,
  type Atributo,
  type Carta
} from '@hemp-trunfo/engine'

interface JogoState {
  partida: EstadoPartida | null
  iniciarPartida: (nomes: string[]) => void
  jogarAtributo: (atributo: Atributo) => void
  getCartaTopo: (jogadorId: string) => Carta | null
  podeJogar: (jogadorId: string) => boolean
}

export const useJogoStore = create<JogoState>((set, get) => ({
  partida: null,

  iniciarPartida: (nomes) => {
    const partida = criarPartida(nomes, baralhoCompleto)
    set({ partida })
  },

  jogarAtributo: (atributo) => {
    const { partida } = get()
    if (!partida) return

    const jogadorAtual = partida.jogadores[partida.turnoAtual]
    if (!podeEscolherAtributo(partida, jogadorAtual.id)) return

    const novoEstado = escolherAtributo(partida, atributo)
    set({ partida: novoEstado })
  },

  getCartaTopo: (jogadorId) => {
    const { partida } = get()
    if (!partida) return null
    const jogador = partida.jogadores.find(j => j.id === jogadorId)
    return jogador ? obterCartaTopo(jogador) : null
  },

  podeJogar: (jogadorId) => {
    const { partida } = get()
    if (!partida) return false
    return podeEscolherAtributo(partida, jogadorId)
  }
}))
