import type { Atributo, Carta, Jogador, ResultadoRodada } from '../types.js';
/**
 * Compara as cartas de topo de dois (ou mais) jogadores para uma rodada.
 *
 * Prioridade de resolução:
 *  1. Carta VANTAGEM vence automaticamente (se houver exatamente uma).
 *  2. Carta REVÉS perde automaticamente (os demais disputam).
 *  3. Comparação numérica pelo atributo escolhido: maior valor vence.
 *  4. Empate no maior valor → rodada vai para o monte (empate = true).
 *
 * @param jogadores  Lista de jogadores participantes.
 * @param cartasTopo Mapa jogadorId → carta jogada (topo da mão).
 * @param atributo   Atributo escolhido para a disputa.
 */
export declare function compararRodada(jogadores: Jogador[], cartasTopo: Record<string, Carta>, atributo: Atributo): ResultadoRodada;
//# sourceMappingURL=comparador.d.ts.map