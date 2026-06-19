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
} from '@hemp-trunfo/engine'

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
  atributo: Atributo
  cartas: { jogador: string; oponente: string }
  valores: { jogador: number; oponente: number }
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

    // Carta especial (vantagem/revés) de qualquer jogador ENCERRA a partida:
    // quem tirou VANTAGEM vence o jogo; quem tirou REVÉS perde (o oponente vence).
    const vantagem = jogadoresAtivos.find(j => j.cartas[0].tipo === 'vantagem')
    const reves = jogadoresAtivos.find(j => j.cartas[0].tipo === 'reves')

    if (vantagem || reves) {
      let vencedorId: string
      let mensagem: string

      const idHumano = partida.jogadores[0].id

      if (vantagem) {
        vencedorId = vantagem.id
        const quem = vantagem.id === idHumano ? 'Você' : 'Oponente'
        mensagem = `${quem} tirou VANTAGEM e venceu a partida!`
      } else {
        const outro = jogadoresAtivos.find(j => j.id !== reves!.id)
        vencedorId = outro ? outro.id : reves!.id
        const quem = reves!.id === idHumano ? 'Você' : 'Oponente'
        mensagem = `${quem} tirou REVÉS e perdeu a partida!`
      }

      const vencedorNome = partida.jogadores.find(j => j.id === vencedorId)?.nome ?? ''
      const estadoFinal: EstadoPartida = {
        ...partida,
        vencedor: vencedorId,
        finalizada: true,
        historico: [
          ...partida.historico,
          `Rodada ${partida.rodada}: ${mensagem}`,
          `🏆 ${vencedorNome} venceu a partida!`
        ]
      }

      set({
        resultadoPendente: { atributo, vencedorId, mensagem, proximoEstado: estadoFinal }
      })
      return
    }

    // Rodada normal (genéticas): fluxo de duas fases com o botão "Próxima Rodada".
    const resultado = compararRodada(jogadoresAtivos, atributo, partida.monteEmpate)
    const proximoEstado = escolherAtributo(partida, atributo)

    // Registro estruturado da rodada (POV do humano = jogadores[0]).
    const idHumano = partida.jogadores[0].id
    const idOponente = partida.jogadores[1]?.id
    const detHumano = resultado.detalhes.find(d => d.jogadorId === idHumano)
    const detOponente = resultado.detalhes.find(d => d.jogadorId === idOponente)
    const entrada: HistoricoRodada | null = detHumano && detOponente ? {
      rodada: partida.rodada,
      jogadorId: jogadorAtual.id,
      atributo,
      cartas: { jogador: detHumano.carta.nome, oponente: detOponente.carta.nome },
      valores: { jogador: detHumano.valor as number, oponente: detOponente.valor as number },
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
