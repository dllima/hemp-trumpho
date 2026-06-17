import type { Carta, CartaEspecial, CartaGenetica, Atributo } from '../types.js';

/**
 * Helper para montar uma carta genética de forma compacta.
 * A ordem dos valores segue: thc, cbd, relaxamento, foco, felicidade, fome, sono.
 */
function genetica(
  id: string,
  nome: string,
  linhagem: string,
  descricao: string,
  valores: [number, number, number, number, number, number, number]
): CartaGenetica {
  const [thc, cbd, relaxamento, foco, felicidade, fome, sono] = valores;
  return {
    id,
    tipo: 'genetica',
    nome,
    linhagem,
    descricao,
    atributos: { thc, cbd, relaxamento, foco, felicidade, fome, sono },
  };
}

/**
 * As 28 genéticas do baralho Hemp Trunfo.
 * Atributos numa escala de 0 a 100, balanceados para que nenhuma carta
 * domine todos os atributos simultaneamente.
 */
export const GENETICAS: CartaGenetica[] = [
  //        id          nome                 linhagem    descrição                        thc cbd relax foco feliz fome sono
  genetica('g01', 'OG Kush', 'Híbrida', 'Terroso e cítrico, clássico atemporal', [86, 12, 78, 40, 72, 80, 70]),
  genetica('g02', 'Sour Diesel', 'Sativa', 'Diesel pungente e energizante', [88, 8, 35, 90, 84, 55, 20]),
  genetica('g03', 'Granddaddy Purple', 'Indica', 'Uva e frutas com final relaxante', [82, 14, 95, 25, 70, 78, 92]),
  genetica('g04', 'White Widow', 'Híbrida', 'Resinosa e equilibrada', [80, 16, 65, 60, 78, 62, 55]),
  genetica('g05', 'Blue Dream', 'Híbrida', 'Mirtilo doce e suave', [78, 18, 60, 72, 88, 58, 45]),
  genetica('g06', 'Northern Lights', 'Indica', 'Doce e terrosa, profundamente calmante', [84, 10, 92, 30, 68, 70, 90]),
  genetica('g07', 'Jack Herer', 'Sativa', 'Pinho e especiarias, cerebral', [85, 12, 38, 92, 80, 50, 22]),
  genetica('g08', 'Girl Scout Cookies', 'Híbrida', 'Doce e amadeirada, potente', [90, 9, 72, 55, 82, 84, 60]),
  genetica('g09', 'Pineapple Express', 'Híbrida', 'Abacaxi tropical e energético', [76, 15, 50, 78, 90, 66, 35]),
  genetica('g10', 'AK-47', 'Híbrida', 'Floral e terrosa, longa duração', [83, 13, 58, 68, 76, 60, 48]),
  genetica('g11', 'Gorilla Glue #4', 'Híbrida', 'Resina densa, efeito grudento', [92, 7, 84, 45, 74, 82, 78]),
  genetica('g12', 'Amnesia Haze', 'Sativa', 'Cítrica e terrosa, euforizante', [87, 11, 32, 94, 86, 52, 18]),
  genetica('g13', 'Bubba Kush', 'Indica', 'Café e chocolate, sedativa', [79, 14, 94, 22, 64, 76, 95]),
  genetica('g14', 'Green Crack', 'Sativa', 'Manga doce, foco afiado', [81, 10, 30, 96, 88, 48, 15]),
  genetica('g15', 'Charlotte\'s Web', 'CBD', 'Rica em CBD, quase sem efeito psicoativo', [6, 92, 80, 50, 60, 30, 65]),
  genetica('g16', 'ACDC', 'CBD', 'Equilíbrio terapêutico, baixo THC', [10, 88, 75, 55, 58, 28, 60]),
  genetica('g17', 'Harlequin', 'CBD', 'Sativa rica em CBD, clareza mental', [12, 82, 55, 70, 66, 35, 40]),
  genetica('g18', 'Cannatonic', 'CBD', 'Suave e relaxante, alto CBD', [14, 85, 78, 48, 62, 32, 58]),
  genetica('g19', 'Durban Poison', 'Sativa', 'Anis doce, pura sativa', [86, 9, 28, 95, 85, 46, 16]),
  genetica('g20', 'Wedding Cake', 'Híbrida', 'Baunilha e amêndoa, rica', [91, 8, 76, 52, 80, 86, 64]),
  genetica('g21', 'Zkittlez', 'Indica', 'Frutas doces, calmante', [80, 13, 88, 35, 84, 80, 82]),
  genetica('g22', 'Trainwreck', 'Híbrida', 'Limão e pinho, impacto rápido', [85, 10, 45, 82, 82, 56, 30]),
  genetica('g23', 'Purple Haze', 'Sativa', 'Frutas doces, nostálgica', [82, 12, 42, 84, 90, 54, 28]),
  genetica('g24', 'Skywalker OG', 'Indica', 'Especiarias e frutas, potente', [89, 11, 90, 32, 72, 78, 88]),
  genetica('g25', 'Super Lemon Haze', 'Sativa', 'Limão azedo, vibrante', [84, 10, 36, 90, 88, 50, 24]),
  genetica('g26', 'Do-Si-Dos', 'Indica', 'Floral e doce, corporal', [88, 9, 91, 28, 70, 82, 86]),
  genetica('g27', 'Strawberry Cough', 'Sativa', 'Morango doce, social', [77, 14, 40, 80, 92, 58, 32]),
  genetica('g28', 'Gelato', 'Híbrida', 'Sobremesa cremosa, equilibrada', [85, 11, 70, 58, 86, 84, 58]),
];

/** Carta VANTAGEM: vence automaticamente a rodada. */
export const CARTA_VANTAGEM: CartaEspecial = {
  id: 's-vantagem',
  tipo: 'vantagem',
  nome: 'Vantagem',
  descricao: 'Vence automaticamente a rodada, independentemente do atributo.',
};

/** Carta REVÉS: perde automaticamente a rodada. */
export const CARTA_REVES: CartaEspecial = {
  id: 's-reves',
  tipo: 'reves',
  nome: 'Revés',
  descricao: 'Perde automaticamente a rodada, independentemente do atributo.',
};

/** Carta INFORMATIVA: curiosidades sobre a planta. Não é jogável. */
export const CARTA_INFORMATIVA: CartaEspecial = {
  id: 's-informativa',
  tipo: 'informativa',
  nome: 'Você Sabia?',
  descricao:
    'A cannabis produz mais de 100 canabinoides diferentes. THC e CBD são apenas os mais conhecidos.',
};

/** Carta REGRAS: explica como jogar. Não é jogável. */
export const CARTA_REGRAS: CartaEspecial = {
  id: 's-regras',
  tipo: 'regras',
  nome: 'Regras',
  descricao:
    'Maior valor vence a rodada. Empate manda as cartas para o monte. Vantagem sempre vence, Revés sempre perde.',
};

/** Todas as cartas especiais. */
export const ESPECIAIS: CartaEspecial[] = [
  CARTA_VANTAGEM,
  CARTA_REVES,
  CARTA_INFORMATIVA,
  CARTA_REGRAS,
];

/** Baralho completo: 28 genéticas + 4 especiais = 32 cartas. */
export const BARALHO_COMPLETO: Carta[] = [...GENETICAS, ...ESPECIAIS];

/**
 * Embaralha um array de cartas (Fisher-Yates) retornando uma nova lista.
 * Não muta o array original.
 */
export function embaralhar<T>(cartas: readonly T[]): T[] {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Verifica se uma carta pode ser usada em rodada (genéticas, Vantagem e Revés).
 * Cartas Informativa e Regras são removidas do jogo.
 */
export function ehCartaJogavel(carta: Carta): boolean {
  return (
    carta.tipo === 'genetica' ||
    carta.tipo === 'vantagem' ||
    carta.tipo === 'reves'
  );
}

/**
 * Filtra apenas as cartas jogáveis de um conjunto,
 * removendo as cartas Informativa e Regras.
 */
export function filtrarCartasJogaveis(cartas: readonly Carta[]): Carta[] {
  return cartas.filter(ehCartaJogavel);
}

/** Valor de um atributo numérico de qualquer carta (especiais retornam null). */
export function valorAtributo(carta: Carta, atributo: Atributo): number | null {
  return carta.tipo === 'genetica' ? carta.atributos[atributo] : null;
}
