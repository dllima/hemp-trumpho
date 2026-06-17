import type { Atributo, Carta, EstadoPartida, Jogador, ResultadoRodada } from '../types.js';
export interface OpcoesPartida {
    nomeJogador?: string;
    nomeIA?: string;
    /** Baralho customizado (para testes). Padrão: baralho completo. */
    baralho?: Carta[];
}
/**
 * Cria uma nova partida 1x1 (jogador humano vs IA).
 * As cartas jogáveis são embaralhadas e distribuídas igualmente.
 */
export declare function criarPartida(opcoes?: OpcoesPartida): EstadoPartida;
/** Retorna o jogador pelo id, ou undefined. */
export declare function obterJogador(estado: EstadoPartida, id: string): Jogador | undefined;
/** Retorna a carta do topo da mão de um jogador (índice 0), ou null. */
export declare function obterCartaTopo(estado: EstadoPartida, jogadorId: string): Carta | null;
/**
 * Indica se o jogador informado pode escolher o atributo agora:
 * a partida precisa estar em jogo e ser a vez dele.
 */
export declare function podeEscolherAtributo(estado: EstadoPartida, jogadorId: string): boolean;
/**
 * Executa uma rodada completa a partir do atributo escolhido pelo jogador ativo.
 * Atualiza mãos, monte, histórico, vez e verifica fim de jogo.
 *
 * @returns Novo estado da partida e o resultado da rodada.
 */
export declare function escolherAtributo(estado: EstadoPartida, jogadorId: string, atributo: Atributo): {
    estado: EstadoPartida;
    resultado: ResultadoRodada;
};
//# sourceMappingURL=gerenciador.d.ts.map