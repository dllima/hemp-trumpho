import type { EstadoPartida, Jogador, Carta, Atributo } from '../types.js';
export declare function criarPartida(nomesJogadores: string[], cartasDisponiveis: Carta[]): EstadoPartida;
export declare function escolherAtributo(estado: EstadoPartida, atributo: Atributo): EstadoPartida;
export declare function obterCartaTopo(jogador: Jogador): Carta | null;
export declare function podeEscolherAtributo(estado: EstadoPartida, jogadorId: string): boolean;
//# sourceMappingURL=gerenciador.d.ts.map