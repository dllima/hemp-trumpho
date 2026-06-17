import { criarPartida, escolherAtributo, baralhoCompleto } from '../dist/index.js';

console.log('🧪 TESTE DA ENGINE - Hemp Trunfo\n');

const partida = criarPartida(['Jogador 1', 'Jogador 2'], baralhoCompleto);
console.log('=== PARTIDA INICIADA ===');
console.log('Jogador 1 cartas:', partida.jogadores[0].cartas.length);
console.log('Jogador 2 cartas:', partida.jogadores[1].cartas.length);
console.log('Carta topo J1:', partida.jogadores[0].cartas[0].nome);
console.log('Carta topo J2:', partida.jogadores[1].cartas[0].nome);

let estado = partida;
const atributos = ['thc', 'relaxamento', 'foco', 'felicidade', 'fome', 'sono'];

for (let i = 0; i < 10 && !estado.finalizada; i++) {
  const atributo = atributos[Math.floor(Math.random() * atributos.length)];
  console.log(`\n--- RODADA ${estado.rodada} ---`);
  console.log(`Turno: ${estado.jogadores[estado.turnoAtual].nome}`);
  console.log(`Atributo: ${atributo}`);

  estado = escolherAtributo(estado, atributo);
  console.log('Resultado:', estado.historico[estado.historico.length - 1]);
  console.log('Cartas J1:', estado.jogadores[0].cartas.length);
  console.log('Cartas J2:', estado.jogadores[1].cartas.length);
  console.log('Monte:', estado.monteEmpate.length);
}

console.log('\n=== FIM? ===', estado.finalizada);
if (estado.vencedor) {
  const v = estado.jogadores.find(j => j.id === estado.vencedor);
  console.log('🏆 VENCEDOR:', v.nome);
}
console.log('\n✅ Teste concluído!');
