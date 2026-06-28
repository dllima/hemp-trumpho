import type { Carta, CartaGenetica, Baralho } from '../types.js';

// As 28 genéticas do baralho original (sem as especiais, que são globais).
export const geneticasOriginal: CartaGenetica[] = [
  {
    id: 'A1', nome: "Clockwork Orange", banco: "Crazy Seeds",
    descricao: "Seu nome é em homenagem ao clássico time da seleção holandesa de 1972. Terpenos cítricos, cheiro forte de laranja e com produção elevada de resina.",
    thc: 21, cbd: 0.03, relaxamento: 25, foco: 91, felicidade: 41, fome: 59, sono: 20,
    tipo: 'genetica'
  },
  {
    id: 'A2', nome: "Monkey Fever", banco: "Crazy Seeds",
    descricao: "A 'Febre do Macaco', tem um sabor curioso que lembra uva passa. Sua genética 100% Indica, de uma mistura de Afghan com Gorilla. Suas folhas podem ficar pretas.",
    thc: 21, cbd: 0.04, relaxamento: 94, foco: 47, felicidade: 63, fome: 81, sono: 100,
    tipo: 'genetica'
  },
  {
    id: 'A3', nome: "Stinky Fat", banco: "Crazy Seeds",
    descricao: "Quando você sente o cheiro, parece queijo azedo. Suas flores são densas e seus galhos possuem muitas ramificações. Ótima para técnicas de amarração.",
    thc: 25, cbd: 0.11, relaxamento: 57, foco: 69, felicidade: 90, fome: 77, sono: 55,
    tipo: 'genetica'
  },
  {
    id: 'A4', nome: "Crazy Haze", banco: "Crazy Seeds",
    descricao: "Anos de cruzas deixaram essa cepa pegajosa, que não faz tossir mas deixa um sabor picante. O nome significa 'Névoa Maluca' e suas flores podem ficar roxas.",
    thc: 21, cbd: 0.01, relaxamento: 100, foco: 27, felicidade: 75, fome: 84, sono: 93,
    tipo: 'genetica'
  },
  {
    id: 'A5', nome: "Black Harpia", banco: "Crazy Seeds",
    descricao: "Genética brasileira conhecida por suas flores pretas. O seu nome faz jus ao 'Gavião Real', a maior ave de rapina do mundo e nativa da América Latina.",
    thc: 26, cbd: 0.03, relaxamento: 70, foco: 63, felicidade: 71, fome: 55, sono: 70,
    tipo: 'genetica'
  },
  {
    id: 'A6', nome: "Sucreme", banco: "Crazy Seeds",
    descricao: "Planta de alto rendimento. Não se ramifica tanto, mas sua resina se transforma facilmente em creme nas mãos de quem faz uma boa extração.",
    thc: 21, cbd: 0.07, relaxamento: 70, foco: 30, felicidade: 90, fome: 100, sono: 100,
    tipo: 'genetica'
  },
  {
    id: 'A7', nome: "50/50", banco: "Crazy Seeds",
    descricao: "Mistura norte-americana e holandesa com aroma cítrico e fresco, lembrando morangos. Seu nome faz referência por ser uma Híbrida com 50% Indica e 50% Sativa.",
    thc: 23, cbd: 0.05, relaxamento: 50, foco: 50, felicidade: 50, fome: 50, sono: 50,
    tipo: 'genetica'
  },
  {
    id: 'A8', nome: "T.N.T", banco: "Crazy Seeds",
    descricao: "Seus terpenos terrosos são uma bomba de sabor. Conta com cálices largos e folhas pequenas, não precisando de muitas podas em seu cultivo.",
    thc: 23, cbd: 0.03, relaxamento: 20, foco: 38, felicidade: 29, fome: 77, sono: 65,
    tipo: 'genetica'
  },
  {
    id: 'A9', nome: "Krumble Juice", banco: "Crazy Seeds",
    descricao: "Híbrida com predominância Indica que não oferece um rendimento tão grande em flores. Porém sua resina é bastante densa, uma excelente opção para extrações.",
    thc: 24, cbd: 0.07, relaxamento: 83, foco: 41, felicidade: 72, fome: 78, sono: 80,
    tipo: 'genetica'
  },
  {
    id: 'A10', nome: "Color Party", banco: "Crazy Seeds",
    descricao: "Proveniente de um cruzamento entre Purples, essa é uma planta multicolor. Suas flores e folhas ficam pretas ou verdes, muitas vezes as duas no mesmo pé.",
    thc: 25.5, cbd: 0.03, relaxamento: 96, foco: 43, felicidade: 94, fome: 61, sono: 78,
    tipo: 'genetica'
  },
  {
    id: 'A11', nome: "Tropikali", banco: "Crazy Seeds",
    descricao: "Uma homenagem a um grande ativista da cena canábica brasileira. A Tropikali possui aroma, sabor tropical e resulta quase sempre em flores roxas.",
    thc: 22, cbd: 0.1, relaxamento: 70, foco: 64, felicidade: 70, fome: 83, sono: 40,
    tipo: 'genetica'
  },
  {
    id: 'A12', nome: "Hulk Lemonade", banco: "Crazy Seeds",
    descricao: "Planta 100% Sativa de um tom verde claro e sabor de limão. O nome diz tudo. Suas mudas são resistentes, suas sementes são grandes e as flores muito resinadas.",
    thc: 27, cbd: 0, relaxamento: 0, foco: 100, felicidade: 50, fome: 50, sono: 0,
    tipo: 'genetica'
  },
  {
    id: 'B1', nome: "Mokum's Tulip", banco: "Dutch Passion",
    descricao: "Buds densos, perfume de caramelo e cores que vão do roxo ao azulado. Essa planta é uma verdadeira maravilha da natureza.",
    thc: 19, cbd: 0.01, relaxamento: 75, foco: 80, felicidade: 90, fome: 75, sono: 68,
    tipo: 'genetica'
  },
  {
    id: 'B2', nome: "Auto Lemon Kix", banco: "Dutch Passion",
    descricao: "Com flores que facilmente atingem o tamanho de bolas de tênis, essa genética carrega a herança de uma Las Vegas Lemon Skunk.",
    thc: 23, cbd: 0.05, relaxamento: 60, foco: 80, felicidade: 100, fome: 60, sono: 55,
    tipo: 'genetica'
  },
  {
    id: 'B3', nome: "Kerosene Krash", banco: "Dutch Passion",
    descricao: "Considerada uma queridinha das extrações pela alta quantidade de resina, essa planta tem um cheiro tão forte que parece querosene (uma delícia).",
    thc: 19, cbd: 0.01, relaxamento: 75, foco: 80, felicidade: 90, fome: 75, sono: 68,
    tipo: 'genetica'
  },
  {
    id: 'C1', nome: "Carolina Dream", banco: "Redwood",
    descricao: "Genética forte no CBD. Produz bastante extrato para fabricação de óleo e a magia dos terpenos pode garantir o cheiro de chocolate, pinho ou óleo diesel.",
    thc: 0.3, cbd: 18, relaxamento: 90, foco: 89, felicidade: 84, fome: 86, sono: 60,
    tipo: 'genetica'
  },
  {
    id: 'C2', nome: "Golden Redwood", banco: "Redwood",
    descricao: "Predominantemente Sativa e com sabor de tangerina, é conhecida por proporcionar uma sensação geral de bem estar, deixando no ar uma fome controlada.",
    thc: 0.3, cbd: 21, relaxamento: 92, foco: 92, felicidade: 83, fome: 73, sono: 50,
    tipo: 'genetica'
  },
  {
    id: 'C3', nome: "Wild Bourbon", banco: "Redwood",
    descricao: "Daquelas genéticas que ficam roxas com a chegada do inverno. A combinação de terpenos deixa um cheiro amadeirado, com toques de ameixa, maçã e carvalho.",
    thc: 0.3, cbd: 18, relaxamento: 87, foco: 100, felicidade: 96, fome: 64, sono: 30,
    tipo: 'genetica'
  },
  {
    id: 'D1', nome: "Jack Orange", banco: "Gea Seeds",
    descricao: "Com seu cheirinho de laranja é ótima para combater a enxaqueca. Genética Híbrida, nascida de uma cruza entre Black Kush 98 com a famosa Jack Herer.",
    thc: 23, cbd: 1, relaxamento: 52, foco: 92, felicidade: 100, fome: 85, sono: 53,
    tipo: 'genetica'
  },
  {
    id: 'E1', nome: "AK-47", banco: "Clássicas",
    descricao: "Uma das genéticas mais populares da história e não é à toa. Tem esse nome pois segundo as lendas 'faz a cabeça com um hit só'.",
    thc: 20, cbd: 2, relaxamento: 95, foco: 52, felicidade: 82, fome: 80, sono: 40,
    tipo: 'genetica'
  },
  {
    id: 'E2', nome: "Skunk #1", banco: "Clássicas",
    descricao: "A lendária Skunk #1 é usada até hoje para dar origem a outras genéticas. Graças a essa planta que o nome 'skunk' sempre é relacionado a qualquer ganja potente.",
    thc: 20, cbd: 2, relaxamento: 95, foco: 52, felicidade: 82, fome: 80, sono: 40,
    tipo: 'genetica'
  },
  {
    id: 'E3', nome: "Pineapple Express", banco: "Clássicas",
    descricao: "Planta híbrida que pode ser cultivada dentro e fora de casa. O efeito intenso da Pineapple Express fez tanto sucesso que já foi até tema de filme.",
    thc: 17, cbd: 0.6, relaxamento: 90, foco: 55, felicidade: 90, fome: 74, sono: 45,
    tipo: 'genetica'
  },
  {
    id: 'E4', nome: "Buddah Cheese", banco: "Clássicas",
    descricao: "Predominante Indica, com flores gordas e terpenos intensos que fazem lembrar queijo, tanto no cheiro quanto no sabor. Seu efeito faz o usuário meditar.",
    thc: 16, cbd: 0.2, relaxamento: 98, foco: 91, felicidade: 60, fome: 87, sono: 77,
    tipo: 'genetica'
  },
  {
    id: 'E5', nome: "White Widow", banco: "Clássicas",
    descricao: "Originada de uma mistura entre a brasileira Manga Rosa e uma genética do sul da Índia, a White Widow é, há mais de vinte anos, uma das favoritas dos jardineiros.",
    thc: 18, cbd: 1, relaxamento: 86, foco: 83, felicidade: 88, fome: 90, sono: 48,
    tipo: 'genetica'
  },
  {
    id: 'E6', nome: "Sour Diesel", banco: "Clássicas",
    descricao: "Também conhecida como 'Sour D', é uma genética Sativa originária da cruza entre a Chemdawg e a Super Skunk. O efeito é rápido e sim, o cheiro é de óleo diesel.",
    thc: 25, cbd: 0.3, relaxamento: 93, foco: 89, felicidade: 95, fome: 80, sono: 57,
    tipo: 'genetica'
  },
  {
    id: 'E7', nome: "Blue Dream", banco: "Clássicas",
    descricao: "Uma genética Híbrida com predominância Sativa. Essa planta produz um efeito balanceado que estimula o cérebro e o completo relaxamento do corpo.",
    thc: 20, cbd: 0.2, relaxamento: 99, foco: 70, felicidade: 92, fome: 40, sono: 66,
    tipo: 'genetica'
  },
  {
    id: 'F1', nome: "Manga Rosa", banco: "Brasileiras",
    descricao: "A genética mais famosa do Brasil é conhecida por seu aroma adocicado e sabor frutado. Ótimos efeitos sedativos para o uso noturno e momentos de descanso.",
    thc: 16, cbd: 0.01, relaxamento: 85, foco: 70, felicidade: 99, fome: 87, sono: 90,
    tipo: 'genetica'
  },
  {
    id: 'F2', nome: "Cabrobó", banco: "Brasileiras",
    descricao: "A Cabrobó é uma planta que cresce rápido. Cultivada ao ar livre devido à boa adaptação ao clima da região do 'Polígono da Maconha', no Nordeste brasileiro.",
    thc: 14, cbd: 0.02, relaxamento: 83, foco: 68, felicidade: 86, fome: 99, sono: 70,
    tipo: 'genetica'
  },
];

// Cartas especiais GLOBAIS — injetadas em TODA partida, não pertencem a um
// baralho específico. Saíram do array do baralho nesta fatia.
export const especiaisGlobais: Carta[] = [
  {
    id: 'VANTAGEM', nome: "VANTAGEM", tipo: 'vantagem',
    efeito: "Sorte! Você venceu essa rodada."
  },
  {
    id: 'REVÉS', nome: "REVÉS", tipo: 'reves',
    efeito: "Ih! Ferrou! Essa plantinha mofou. Você perdeu essa rodada."
  }
];

// O baralho original como entidade. id/nome PROVISÓRIOS (confirmar no smoke).
export const baralhoOriginal: Baralho = {
  id: 'original',
  nome: 'Baralho Original',
  cartas: geneticasOriginal,
};

// Registry de baralhos disponíveis (por ora só o original).
export const baralhos: Record<string, Baralho> = {
  original: baralhoOriginal,
};

// COMPAT: baralhoCompleto = genéticas + especiais (idêntico ao de antes), para
// não quebrar consumidores existentes (Home, teste) nesta fatia.
export const baralhoCompleto: Carta[] = [...geneticasOriginal, ...especiaisGlobais];

export function embaralhar(cartas: Carta[]): Carta[] {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function filtrarCartasJogaveis(cartas: Carta[]): Carta[] {
  return cartas.filter(c => c.tipo === 'genetica' || c.tipo === 'vantagem' || c.tipo === 'reves');
}
