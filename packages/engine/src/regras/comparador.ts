import type {
  Atributo,
  Carta,
  Jogador,
  ResultadoRodada,
} from '../types.js';
import { valorAtributo } from '../cartas/baralho.js';

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
export function compararRodada(
  jogadores: Jogador[],
  cartasTopo: Record<string, Carta>,
  atributo: Atributo
): ResultadoRodada {
  const cartas: Record<string, Carta> = {};
  const valores: Record<string, number | null> = {};

  for (const jogador of jogadores) {
    const carta = cartasTopo[jogador.id];
    cartas[jogador.id] = carta;
    valores[jogador.id] = valorAtributo(carta, atributo);
  }

  const comVantagem = jogadores.filter(
    (j) => cartasTopo[j.id]?.tipo === 'vantagem'
  );
  const comReves = jogadores.filter((j) => cartasTopo[j.id]?.tipo === 'reves');

  // 1. VANTAGEM: se exatamente um jogador tem, ele vence direto.
  if (comVantagem.length === 1) {
    const vencedor = comVantagem[0];
    return {
      atributo,
      vencedorId: vencedor.id,
      empate: false,
      valores,
      cartas,
      motivo: `${vencedor.nome} jogou a carta Vantagem e venceu automaticamente.`,
    };
  }

  // Mais de uma Vantagem (ou nenhuma) → essas se anulam entre si:
  // os candidatos passam a ser todos menos os que jogaram Revés,
  // exceto se todos jogaram Revés.
  const candidatos = jogadores.filter((j) => {
    const c = cartasTopo[j.id];
    if (comVantagem.length > 1) {
      // Quando há múltiplas vantagens, elas competem entre si.
      return c.tipo === 'vantagem';
    }
    // Caso geral: quem jogou Revés está fora, a menos que todos sejam Revés.
    return c.tipo !== 'reves';
  });

  // 2. Caso todos tenham jogado Revés (ou só sobrou Revés), é empate → monte.
  if (candidatos.length === 0) {
    return {
      atributo,
      vencedorId: null,
      empate: true,
      valores,
      cartas,
      motivo: 'Todos jogaram Revés. As cartas vão para o monte.',
    };
  }

  // Se sobrou exatamente um candidato (ex.: o oponente jogou Revés), ele vence.
  if (candidatos.length === 1 && comReves.length > 0) {
    const vencedor = candidatos[0];
    return {
      atributo,
      vencedorId: vencedor.id,
      empate: false,
      valores,
      cartas,
      motivo: `Oponente jogou Revés. ${vencedor.nome} venceu a rodada.`,
    };
  }

  // 3. Comparação numérica entre os candidatos.
  // Cartas especiais (vantagens múltiplas) valem -Infinity para o atributo,
  // garantindo que não vençam por número.
  const pontuar = (jogador: Jogador): number => {
    const v = valores[jogador.id];
    return v === null ? Number.NEGATIVE_INFINITY : v;
  };

  let maiorValor = Number.NEGATIVE_INFINITY;
  for (const j of candidatos) {
    maiorValor = Math.max(maiorValor, pontuar(j));
  }

  const vencedores = candidatos.filter((j) => pontuar(j) === maiorValor);

  // 4. Empate no topo → monte.
  if (vencedores.length !== 1) {
    return {
      atributo,
      vencedorId: null,
      empate: true,
      valores,
      cartas,
      motivo: `Empate no atributo selecionado (${maiorValor}). As cartas vão para o monte.`,
    };
  }

  const vencedor = vencedores[0];
  return {
    atributo,
    vencedorId: vencedor.id,
    empate: false,
    valores,
    cartas,
    motivo: `${vencedor.nome} venceu com ${maiorValor} no atributo selecionado.`,
  };
}
