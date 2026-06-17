import type { Carta, CartaEspecial, CartaGenetica, Atributo } from '../types.js';
/**
 * As 28 genéticas do baralho Hemp Trunfo.
 * Atributos numa escala de 0 a 100, balanceados para que nenhuma carta
 * domine todos os atributos simultaneamente.
 */
export declare const GENETICAS: CartaGenetica[];
/** Carta VANTAGEM: vence automaticamente a rodada. */
export declare const CARTA_VANTAGEM: CartaEspecial;
/** Carta REVÉS: perde automaticamente a rodada. */
export declare const CARTA_REVES: CartaEspecial;
/** Carta INFORMATIVA: curiosidades sobre a planta. Não é jogável. */
export declare const CARTA_INFORMATIVA: CartaEspecial;
/** Carta REGRAS: explica como jogar. Não é jogável. */
export declare const CARTA_REGRAS: CartaEspecial;
/** Todas as cartas especiais. */
export declare const ESPECIAIS: CartaEspecial[];
/** Baralho completo: 28 genéticas + 4 especiais = 32 cartas. */
export declare const BARALHO_COMPLETO: Carta[];
/**
 * Embaralha um array de cartas (Fisher-Yates) retornando uma nova lista.
 * Não muta o array original.
 */
export declare function embaralhar<T>(cartas: readonly T[]): T[];
/**
 * Verifica se uma carta pode ser usada em rodada (genéticas, Vantagem e Revés).
 * Cartas Informativa e Regras são removidas do jogo.
 */
export declare function ehCartaJogavel(carta: Carta): boolean;
/**
 * Filtra apenas as cartas jogáveis de um conjunto,
 * removendo as cartas Informativa e Regras.
 */
export declare function filtrarCartasJogaveis(cartas: readonly Carta[]): Carta[];
/** Valor de um atributo numérico de qualquer carta (especiais retornam null). */
export declare function valorAtributo(carta: Carta, atributo: Atributo): number | null;
//# sourceMappingURL=baralho.d.ts.map