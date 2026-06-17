import { create } from 'zustand';
import {
  criarPartida,
  escolherAtributo,
  obterCartaTopo,
  podeEscolherAtributo,
  ATRIBUTOS,
  type Atributo,
  type Carta,
  type EstadoPartida,
  type ResultadoRodada,
} from '@hemp-trunfo/engine';

interface JogoState {
  partida: EstadoPartida | null;
  /** Resultado da última rodada resolvida, para feedback visual. */
  ultimoResultado: ResultadoRodada | null;
  /** Trava de UI enquanto uma rodada está sendo resolvida/animada. */
  processando: boolean;

  iniciarPartida: () => void;
  jogarAtributo: (atributo: Atributo) => void;
  getCartaTopo: (jogadorId: string) => Carta | null;
  podeJogar: (jogadorId: string) => boolean;
}

const ID_JOGADOR = 'jogador';
const ID_IA = 'ia';

export const useJogoStore = create<JogoState>((set, get) => ({
  partida: null,
  ultimoResultado: null,
  processando: false,

  iniciarPartida: () => {
    set({
      partida: criarPartida(),
      ultimoResultado: null,
      processando: false,
    });
  },

  jogarAtributo: (atributo: Atributo) => {
    const { partida, processando } = get();
    if (!partida || processando) return;
    if (partida.fase !== 'em_jogo') return;

    const ativoId = partida.jogadorAtivoId;
    if (!podeEscolherAtributo(partida, ativoId)) return;

    set({ processando: true });

    const { estado, resultado } = escolherAtributo(partida, ativoId, atributo);

    set({ partida: estado, ultimoResultado: resultado });

    // Se terminou ou agora é a vez do humano, libera a UI.
    if (estado.fase !== 'em_jogo') {
      set({ processando: false });
      return;
    }

    if (estado.jogadorAtivoId === ID_JOGADOR) {
      set({ processando: false });
      return;
    }

    // Vez da IA: escolhe um atributo aleatório após um breve delay.
    agendarJogadaIA(get, set);
  },

  getCartaTopo: (jogadorId: string) => {
    const { partida } = get();
    if (!partida) return null;
    return obterCartaTopo(partida, jogadorId);
  },

  podeJogar: (jogadorId: string) => {
    const { partida, processando } = get();
    if (!partida || processando) return false;
    return podeEscolherAtributo(partida, jogadorId);
  },
}));

/**
 * Agenda a jogada automática da IA: após 1.5s escolhe um atributo aleatório.
 * Se a IA vencer e continuar com a vez, encadeia novas jogadas até passar
 * o turno ao humano ou a partida acabar.
 */
function agendarJogadaIA(
  get: () => JogoState,
  set: (partial: Partial<JogoState>) => void
) {
  setTimeout(() => {
    const { partida } = get();
    if (!partida || partida.fase !== 'em_jogo') {
      set({ processando: false });
      return;
    }
    if (partida.jogadorAtivoId !== ID_IA) {
      set({ processando: false });
      return;
    }

    const atributo = escolherAtributoIA();
    const { estado, resultado } = escolherAtributo(partida, ID_IA, atributo);
    set({ partida: estado, ultimoResultado: resultado });

    if (estado.fase !== 'em_jogo') {
      set({ processando: false });
      return;
    }

    if (estado.jogadorAtivoId === ID_IA) {
      // IA venceu de novo: continua jogando.
      agendarJogadaIA(get, set);
    } else {
      set({ processando: false });
    }
  }, 1500);
}

/** Estratégia simples da IA: escolhe um atributo aleatório. */
function escolherAtributoIA(): Atributo {
  const i = Math.floor(Math.random() * ATRIBUTOS.length);
  return ATRIBUTOS[i];
}
