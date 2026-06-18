import type { EstadoPartida, Jogador, Carta, Atributo } from '../types.js';
import { embaralhar, filtrarCartasJogaveis } from '../cartas/baralho.js';
import { compararRodada } from '../regras/comparador.js';

export function criarPartida(
  nomesJogadores: string[],
  cartasDisponiveis: Carta[]
): EstadoPartida {
  const cartasJogaveis = filtrarCartasJogaveis(cartasDisponiveis);
  const embaralhadas = embaralhar(cartasJogaveis);

  const cartasPorJogador = Math.floor(embaralhadas.length / nomesJogadores.length);

  const jogadores: Jogador[] = nomesJogadores.map((nome, i) => ({
    id: `j${i}`,
    nome,
    cartas: embaralhadas.slice(
      i * cartasPorJogador, 
      (i + 1) * cartasPorJogador
    )
  }));

  return {
    jogadores,
    monteEmpate: [],
    turnoAtual: 0,
    rodada: 1,
    vencedor: null,
    historico: [`Partida iniciada! ${nomesJogadores.length} jogadores.`],
    finalizada: false
  };
}

export function escolherAtributo(
  estado: EstadoPartida,
  atributo: Atributo
): EstadoPartida {
  if (estado.finalizada) return estado;

  const jogadoresAtivos = estado.jogadores.filter(j => j.cartas.length > 0);
  const resultado = compararRodada(jogadoresAtivos, atributo, estado.monteEmpate);

  const novoHistorico = [...estado.historico, 
    `Rodada ${estado.rodada}: ${resultado.mensagem}`
  ];

  let novoMonte: Carta[] = [];
  let novosJogadores: Jogador[] = [...estado.jogadores];

  if (resultado.monte) {
    const cartasDaRodada = jogadoresAtivos.map(j => j.cartas[0]);
    novoMonte = [...estado.monteEmpate, ...cartasDaRodada];

    novosJogadores = novosJogadores.map(j => ({
      ...j,
      cartas: j.cartas.length > 0 ? j.cartas.slice(1) : j.cartas
    }));
  } else {
    const vencedorIdx = novosJogadores.findIndex(j => j.id === resultado.vencedor);
    const cartasDaRodada = jogadoresAtivos.map(j => j.cartas[0]);

    novosJogadores = novosJogadores.map(j => ({
      ...j,
      cartas: j.cartas.length > 0 ? j.cartas.slice(1) : j.cartas
    }));

    novosJogadores[vencedorIdx] = {
      ...novosJogadores[vencedorIdx],
      cartas: [
        ...novosJogadores[vencedorIdx].cartas,
        ...cartasDaRodada,
        ...estado.monteEmpate
      ]
    };

    novoMonte = [];
  }

  const jogadoresComCartas = novosJogadores.filter(j => j.cartas.length > 0);
  let vencedorFinal: string | null = null;
  let finalizada = false;

  if (jogadoresComCartas.length === 1) {
    vencedorFinal = jogadoresComCartas[0].id;
    finalizada = true;
    novoHistorico.push(`🏆 ${jogadoresComCartas[0].nome} venceu a partida!`);
  }

  let proximoTurno = estado.turnoAtual;
  if (resultado.vencedor) {
    proximoTurno = novosJogadores.findIndex(j => j.id === resultado.vencedor);
  } else {
    proximoTurno = (estado.turnoAtual + 1) % novosJogadores.length;
    while (novosJogadores[proximoTurno].cartas.length === 0) {
      proximoTurno = (proximoTurno + 1) % novosJogadores.length;
    }
  }

  return {
    jogadores: novosJogadores,
    monteEmpate: novoMonte,
    turnoAtual: proximoTurno,
    rodada: estado.rodada + 1,
    vencedor: vencedorFinal,
    historico: novoHistorico,
    finalizada
  };
}

export function obterCartaTopo(jogador: Jogador): Carta | null {
  return jogador.cartas.length > 0 ? jogador.cartas[0] : null;
}

export function podeEscolherAtributo(estado: EstadoPartida, jogadorId: string): boolean {
  if (estado.finalizada) return false;
  const jogadorAtual = estado.jogadores[estado.turnoAtual];
  return jogadorAtual.id === jogadorId && jogadorAtual.cartas.length > 0;
}
