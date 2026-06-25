import { useCallback } from 'react'
import { useJogoStore } from '../store/jogoStore'
import { type Atributo } from '@hemp-trumpho/engine'

export function usePartida() {
  const { partida, resultadoPendente, iniciarPartida, jogarAtributo, avancarRodada } = useJogoStore()

  const iniciar = useCallback((nomes: string[]) => iniciarPartida(nomes), [iniciarPartida])
  const jogar = useCallback((a: Atributo) => jogarAtributo(a), [jogarAtributo])
  const avancar = useCallback(() => avancarRodada(), [avancarRodada])

  return {
    partida,
    resultadoPendente,
    iniciar,
    jogar,
    avancar,
    jogadorHumano: partida?.jogadores[0] ?? null,
    jogadorIA: partida?.jogadores[1] ?? null,
    ehMinhaVez: partida?.turnoAtual === 0,
    cartaHumano: partida?.jogadores[0]?.cartas[0] ?? null,
    cartaIA: partida?.jogadores[1]?.cartas[0] ?? null,
  }
}
