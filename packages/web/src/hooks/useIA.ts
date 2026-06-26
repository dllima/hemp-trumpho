import { useEffect, useCallback } from 'react'
import { useJogoStore } from '../store/jogoStore'
import { type Atributo } from '@hemp-trumpho/engine'

const ATRIBUTOS: Atributo[] = ['thc', 'cbd', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono']

export function useIA(delayMs = 1500) {
  const { partida, resultadoPendente, jogarAtributo } = useJogoStore()

  const escolher = useCallback((): Atributo => ATRIBUTOS[Math.floor(Math.random() * ATRIBUTOS.length)], [])

  useEffect(() => {
    // Não joga enquanto houver uma rodada revelada aguardando o "Próxima Rodada".
    if (!partida || partida.finalizada || partida.turnoAtual !== 1 || resultadoPendente) return
    const timer = setTimeout(() => jogarAtributo(escolher()), delayMs)
    return () => clearTimeout(timer)
  }, [partida, resultadoPendente, jogarAtributo, escolher, delayMs])
}
