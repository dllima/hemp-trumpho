import type {
  Atributo,
  Carta,
  EstadoPartida,
  Jogador,
  ResultadoRodada,
} from '../types.js';
import {
  BARALHO_COMPLETO,
  embaralhar,
  filtrarCartasJogaveis,
} from '../cartas/baralho.js';
import { compararRodada } from '../regras/comparador.js';

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
export function criarPartida(opcoes: OpcoesPartida = {}): EstadoPartida {
  const {
    nomeJogador = 'Você',
    nomeIA = 'Computador',
    baralho = BARALHO_COMPLETO,
  } = opcoes;

  const jogaveis = embaralhar(filtrarCartasJogaveis(baralho));

  const jogadorCartas: Carta[] = [];
  const iaCartas: Carta[] = [];

  jogaveis.forEach((carta, i) => {
    if (i % 2 === 0) jogadorCartas.push(carta);
    else iaCartas.push(carta);
  });

  const jogador: Jogador = {
    id: 'jogador',
    nome: nomeJogador,
    isIA: false,
    cartas: jogadorCartas,
  };

  const ia: Jogador = {
    id: 'ia',
    nome: nomeIA,
    isIA: true,
    cartas: iaCartas,
  };

  return {
    jogadores: [jogador, ia],
    jogadorAtivoId: jogador.id,
    monte: [],
    fase: 'em_jogo',
    historico: [],
    rodada: 1,
    vencedorPartidaId: null,
  };
}

/** Retorna o jogador pelo id, ou undefined. */
export function obterJogador(
  estado: EstadoPartida,
  id: string
): Jogador | undefined {
  return estado.jogadores.find((j) => j.id === id);
}

/** Retorna a carta do topo da mão de um jogador (índice 0), ou null. */
export function obterCartaTopo(
  estado: EstadoPartida,
  jogadorId: string
): Carta | null {
  const jogador = obterJogador(estado, jogadorId);
  if (!jogador || jogador.cartas.length === 0) return null;
  return jogador.cartas[0];
}

/**
 * Indica se o jogador informado pode escolher o atributo agora:
 * a partida precisa estar em jogo e ser a vez dele.
 */
export function podeEscolherAtributo(
  estado: EstadoPartida,
  jogadorId: string
): boolean {
  return estado.fase === 'em_jogo' && estado.jogadorAtivoId === jogadorId;
}

/** Ordena as cartas ganhas de forma determinística para enfileirar na mão. */
function ordenarGanho(cartas: Carta[]): Carta[] {
  // Mantém a ordem em que entraram; embaralhar levemente evita loops infinitos
  // de empate previsível, mas preservamos determinismo simples aqui.
  return cartas;
}

/**
 * Executa uma rodada completa a partir do atributo escolhido pelo jogador ativo.
 * Atualiza mãos, monte, histórico, vez e verifica fim de jogo.
 *
 * @returns Novo estado da partida e o resultado da rodada.
 */
export function escolherAtributo(
  estado: EstadoPartida,
  jogadorId: string,
  atributo: Atributo
): { estado: EstadoPartida; resultado: ResultadoRodada } {
  if (!podeEscolherAtributo(estado, jogadorId)) {
    throw new Error(
      'Não é possível escolher atributo: não é a vez deste jogador ou a partida não está em jogo.'
    );
  }

  // Clona jogadores e suas mãos para não mutar o estado anterior.
  const jogadores: Jogador[] = estado.jogadores.map((j) => ({
    ...j,
    cartas: [...j.cartas],
  }));

  const cartasTopo: Record<string, Carta> = {};
  for (const j of jogadores) {
    const topo = j.cartas[0];
    if (!topo) {
      throw new Error(`Jogador ${j.nome} não possui cartas para jogar.`);
    }
    cartasTopo[j.id] = topo;
  }

  const resultado = compararRodada(jogadores, cartasTopo, atributo);

  // Remove a carta de topo de cada jogador.
  const emJogo: Carta[] = [];
  for (const j of jogadores) {
    const [carta, ...resto] = j.cartas;
    j.cartas = resto;
    emJogo.push(carta);
  }

  // Cartas em disputa = cartas jogadas + monte acumulado.
  const monteAtual = [...estado.monte];
  const cartasEmDisputa = [...emJogo, ...monteAtual];

  let novoMonte: Carta[] = [];
  let proximoAtivoId = estado.jogadorAtivoId;

  if (resultado.empate || resultado.vencedorId === null) {
    // Empate: cartas vão para o monte; a vez se mantém com o jogador ativo.
    novoMonte = cartasEmDisputa;
  } else {
    // Vencedor leva todas as cartas em disputa para o fim da sua mão.
    const venc = jogadores.find((j) => j.id === resultado.vencedorId)!;
    venc.cartas = [...venc.cartas, ...ordenarGanho(cartasEmDisputa)];
    proximoAtivoId = venc.id; // vencedor escolhe o próximo atributo.
  }

  const historico = [...estado.historico, resultado];

  // Verifica fim de jogo: alguém ficou sem cartas.
  let fase = estado.fase;
  let vencedorPartidaId = estado.vencedorPartidaId;

  const semCartas = jogadores.filter((j) => j.cartas.length === 0);
  const comCartas = jogadores.filter((j) => j.cartas.length > 0);

  if (novoMonte.length === 0 && comCartas.length === 1 && semCartas.length > 0) {
    fase = 'finalizada';
    vencedorPartidaId = comCartas[0].id;
  } else if (comCartas.length === 1 && semCartas.length > 0) {
    // Um jogador zerou, mas há monte pendente: o que tem cartas continua.
    // A partida só termina quando o monte é resolvido. Mantemos em jogo,
    // garantindo que o jogador ativo ainda tenha cartas.
    if (!comCartas.some((j) => j.id === proximoAtivoId)) {
      proximoAtivoId = comCartas[0].id;
    }
  }

  const novoEstado: EstadoPartida = {
    jogadores,
    jogadorAtivoId: proximoAtivoId,
    monte: novoMonte,
    fase,
    historico,
    rodada: estado.rodada + 1,
    vencedorPartidaId,
  };

  return { estado: novoEstado, resultado };
}
