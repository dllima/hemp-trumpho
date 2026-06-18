import type { Carta, Atributo, Jogador } from '../types.js';
export interface ResultadoRodada {
    vencedor: string | null;
    monte: boolean;
    detalhes: {
        jogadorId: string;
        carta: Carta;
        valor: number | string;
        especial: boolean;
    }[];
    atributoEscolhido: Atributo;
    mensagem: string;
}
export declare function compararRodada(jogadores: Jogador[], atributo: Atributo, monteEmpate?: Carta[]): ResultadoRodada;
//# sourceMappingURL=comparador.d.ts.map