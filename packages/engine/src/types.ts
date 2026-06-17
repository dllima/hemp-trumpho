/**
 * Tipos centrais do Hemp Trunfo.
 */

/** Os 7 atributos numéricos comparáveis de uma carta genética. */
export type Atributo =
  | 'thc'
  | 'cbd'
  | 'relaxamento'
  | 'foco'
  | 'felicidade'
  | 'fome'
  | 'sono';

/** Lista ordenada dos atributos, útil para iterar/renderizar. */
export const ATRIBUTOS: Atributo[] = [
  'thc',
  'cbd',
  'relaxamento',
  'foco',
  'felicidade',
  'fome',
  'sono',
];

/** Rótulos amigáveis para exibição na interface. */
export const ATRIBUTO_LABEL: Record<Atributo, string> = {
  thc: 'THC',
  cbd: 'CBD',
  relaxamento: 'Relaxamento',
  foco: 'Foco',
  felicidade: 'Felicidade',
  fome: 'Fome',
  sono: 'Sono',
};

/** Tipo de carta especial (sem atributos numéricos). */
export type TipoEspecial = 'vantagem' | 'reves' | 'informativa' | 'regras';

/** União dos tipos possíveis de carta. */
export type TipoCarta = 'genetica' | TipoEspecial;

/** Carta de genética de cannabis: possui os 7 atributos. */
export interface CartaGenetica {
  id: string;
  tipo: 'genetica';
  nome: string;
  /** Subtítulo/linhagem da genética. */
  linhagem: string;
  /** Descrição curta de sabor. */
  descricao: string;
  atributos: Record<Atributo, number>;
}

/** Carta especial: Vantagem, Revés, Informativa ou Regras. */
export interface CartaEspecial {
  id: string;
  tipo: TipoEspecial;
  nome: string;
  descricao: string;
}

/** Qualquer carta do baralho. */
export type Carta = CartaGenetica | CartaEspecial;

/** Um jogador (humano ou IA) com sua mão (fila de cartas). */
export interface Jogador {
  id: string;
  nome: string;
  isIA: boolean;
  /** Mão do jogador. Índice 0 = topo (carta em jogo). */
  cartas: Carta[];
}

/** Fase atual da partida. */
export type FasePartida = 'aguardando' | 'em_jogo' | 'finalizada';

/** Resultado de uma única rodada já resolvida. */
export interface ResultadoRodada {
  /** Atributo escolhido (null quando decidido por carta especial). */
  atributo: Atributo | null;
  /** id do jogador vencedor, ou null em caso de empate. */
  vencedorId: string | null;
  /** true quando a rodada empatou e as cartas foram para o monte. */
  empate: boolean;
  /** Valores comparados por jogador (apenas para atributos numéricos). */
  valores: Record<string, number | null>;
  /** Carta jogada por cada jogador nesta rodada. */
  cartas: Record<string, Carta>;
  /** Explicação textual do que aconteceu. */
  motivo: string;
}

/** Estado completo de uma partida. */
export interface EstadoPartida {
  jogadores: Jogador[];
  /** id do jogador que escolhe o atributo na rodada atual. */
  jogadorAtivoId: string;
  /** Cartas acumuladas de empates anteriores, vão para o vencedor da próxima rodada. */
  monte: Carta[];
  fase: FasePartida;
  /** Histórico de rodadas (mais recente no fim). */
  historico: ResultadoRodada[];
  /** Número da rodada atual (começa em 1). */
  rodada: number;
  /** id do vencedor da partida, quando finalizada. */
  vencedorPartidaId: string | null;
}
