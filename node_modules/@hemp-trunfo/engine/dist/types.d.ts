export type Atributo = 'thc' | 'cbd' | 'relaxamento' | 'foco' | 'felicidade' | 'fome' | 'sono';
export type TipoCarta = 'genetica' | 'vantagem' | 'reves' | 'informativa';
export interface CartaGenetica {
    id: string;
    nome: string;
    banco: string;
    descricao: string;
    thc: number;
    cbd: number;
    relaxamento: number;
    foco: number;
    felicidade: number;
    fome: number;
    sono: number;
    tipo: 'genetica';
}
export interface CartaEspecial {
    id: string;
    nome: string;
    tipo: 'vantagem' | 'reves';
    efeito: string;
}
export interface CartaInformativa {
    id: string;
    nome: string;
    tipo: 'informativa';
    efeito: string;
}
export type Carta = CartaGenetica | CartaEspecial | CartaInformativa;
export interface Jogador {
    id: string;
    nome: string;
    cartas: Carta[];
}
export interface EstadoPartida {
    jogadores: Jogador[];
    monteEmpate: Carta[];
    turnoAtual: number;
    rodada: number;
    vencedor: string | null;
    historico: string[];
    finalizada: boolean;
}
//# sourceMappingURL=types.d.ts.map