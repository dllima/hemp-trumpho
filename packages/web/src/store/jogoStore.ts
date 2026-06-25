import { create } from 'zustand'
import {
  criarPartida,
  escolherAtributo,
  compararRodada,
  baralhoCompleto,
  obterCartaTopo,
  podeEscolherAtributo,
  type EstadoPartida,
  type Atributo,
  type Carta
} from '@hemp-trumpho/engine'

// Resolução de uma rodada que já foi calculada mas ainda NÃO foi aplicada à partida.
// Isso permite revelar as cartas e o resultado antes de avançar para a próxima rodada,
// dando ao jogador o controle do ritmo do jogo.
interface ResultadoPendente {
  atributo: Atributo
  vencedorId: string | null
  mensagem: string
  proximoEstado: EstadoPartida
}

// Registro estruturado de uma rodada já jogada (do ponto de vista do jogador humano).
export interface HistoricoRodada {
  rodada: number
  jogadorId: string // quem escolheu o atributo nesta rodada
  // 'ESPECIAL' quando a rodada foi decidida por carta VANTAGEM/REVÉS (sem atributo comparado).
  atributo: Atributo | 'ESPECIAL'
  cartas: { jogador: string; oponente: string }
  // string ('CARTA ESPECIAL') nas rodadas especiais; número nas rodadas normais.
  valores: { jogador: number | string; oponente: number | string }
  resultado: 'vitoria' | 'derrota' | 'empate'
}

export type ModoJogo = 'rapido' | 'medio' | 'completo'

// Cartas por jogador em cada modo.
const CARTAS_POR_MODO: Record<ModoJogo, number> = { rapido: 5, medio: 10, completo: 15 }

interface JogoState {
  partida: EstadoPartida | null
  resultadoPendente: ResultadoPendente | null
  historicoRodadas: HistoricoRodada[]
  modo: ModoJogo
  iniciarPartida: (nomes: string[], modo?: ModoJogo) => void
  jogarAtributo: (atributo: Atributo) => void
  avancarRodada: () => void
  getCartaTopo: (jogadorId: string) => Carta | null
  podeJogar: (jogadorId: string) => boolean
}

export const useJogoStore = create<JogoState>((set, get) => ({
  partida: null,
  resultadoPendente: null,
  historicoRodadas: [],
  modo: 'completo',

  iniciarPartida: (nomes, modo) => {
    const modoEscolhido = modo ?? get().modo
    const partida = criarPartida(nomes, baralhoCompleto, CARTAS_POR_MODO[modoEscolhido])
    set({ partida, resultadoPendente: null, historicoRodadas: [], modo: modoEscolhido })
  },

  jogarAtributo: (atributo) => {
    const { partida, resultadoPendente } = get()
    if (!partida || resultadoPendente) return

    const jogadorAtual = partida.jogadores[partida.turnoAtual]
    if (!podeEscolherAtributo(partida, jogadorAtual.id)) return

    const jogadoresAtivos = partida.jogadores.filter(j => j.cartas.length > 0)

    // Resolve a rodada. Cartas especiais (VANTAGEM/REVÉS) são tratadas pela
    // engine como fim de RODADA, não de partida: VANTAGEM vence a rodada e
    // REVÉS a perde (o oponente leva a carta). A partida só finaliza quando um
    // jogador fica com todas as cartas — esse critério vive em escolherAtributo.
    const resultado = compararRodada(jogadoresAtivos, atributo, partida.monteEmpate)
    const proximoEstado = escolherAtributo(partida, atributo)

    // Registro estruturado da rodada (POV do humano = jogadores[0]).
    const idHumano = partida.jogadores[0].id
    const idOponente = partida.jogadores[1]?.id
    const detHumano = resultado.detalhes.find(d => d.jogadorId === idHumano)
    const detOponente = resultado.detalhes.find(d => d.jogadorId === idOponente)
    // Rodada decidida por carta especial (VANTAGEM/REVÉS): não há atributo
    // comparado, então rotula como 'ESPECIAL' em vez do atributo sorteado e
    // mostra "CARTA ESPECIAL" no lugar dos valores numéricos.
    const rodadaEspecial = !!detHumano && !!detOponente && (detHumano.especial || detOponente.especial)
    const entrada: HistoricoRodada | null = detHumano && detOponente ? {
      rodada: partida.rodada,
      jogadorId: jogadorAtual.id,
      atributo: rodadaEspecial ? 'ESPECIAL' : atributo,
      cartas: { jogador: detHumano.carta.nome, oponente: detOponente.carta.nome },
      valores: rodadaEspecial
        ? { jogador: 'CARTA ESPECIAL', oponente: 'CARTA ESPECIAL' }
        : { jogador: detHumano.valor as number, oponente: detOponente.valor as number },
      resultado: resultado.vencedor === idHumano ? 'vitoria'
        : resultado.vencedor === idOponente ? 'derrota'
        : 'empate'
    } : null

    set({
      resultadoPendente: {
        atributo,
        vencedorId: resultado.vencedor,
        mensagem: resultado.mensagem,
        proximoEstado
      },
      historicoRodadas: entrada ? [...get().historicoRodadas, entrada] : get().historicoRodadas
    })
  },

  avancarRodada: () => {
    const { resultadoPendente } = get()
    if (!resultadoPendente) return
    set({ partida: resultadoPendente.proximoEstado, resultadoPendente: null })
  },

  getCartaTopo: (jogadorId) => {
    const { partida } = get()
    if (!partida) return null
    const jogador = partida.jogadores.find((j: { id: string }) => j.id === jogadorId)
    return jogador ? obterCartaTopo(jogador) : null
  },

  podeJogar: (jogadorId) => {
    const { partida, resultadoPendente } = get()
    if (!partida || resultadoPendente) return false
    return podeEscolherAtributo(partida, jogadorId)
  }
}))
