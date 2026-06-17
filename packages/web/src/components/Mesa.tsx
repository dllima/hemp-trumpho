import { AnimatePresence, motion } from 'framer-motion';
import {
  ATRIBUTO_LABEL,
  type Atributo,
} from '@hemp-trunfo/engine';
import { useJogoStore } from '../store/jogoStore';
import Carta from './Carta';

export default function Mesa() {
  const partida = useJogoStore((s) => s.partida);
  const ultimoResultado = useJogoStore((s) => s.ultimoResultado);
  const processando = useJogoStore((s) => s.processando);
  const iniciarPartida = useJogoStore((s) => s.iniciarPartida);
  const jogarAtributo = useJogoStore((s) => s.jogarAtributo);
  const getCartaTopo = useJogoStore((s) => s.getCartaTopo);
  const podeJogar = useJogoStore((s) => s.podeJogar);

  const jogador = partida?.jogadores.find((j) => j.id === 'jogador');
  const ia = partida?.jogadores.find((j) => j.id === 'ia');

  const cartaJogador = getCartaTopo('jogador');
  const cartaIA = getCartaTopo('ia');

  const vezDoJogador = podeJogar('jogador');
  const finalizada = partida?.fase === 'finalizada';
  const vencedor =
    finalizada && partida
      ? partida.jogadores.find((j) => j.id === partida.vencedorPartidaId)
      : null;

  // Revela a carta da IA quando há resultado da rodada ou fim de jogo.
  const revelarIA = Boolean(ultimoResultado) || finalizada;

  const atributoDestaque = ultimoResultado?.atributo ?? null;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
      <Header
        rodada={partida?.rodada ?? 0}
        emJogo={partida?.fase === 'em_jogo'}
        cartasJogador={jogador?.cartas.length ?? 0}
        cartasIA={ia?.cartas.length ?? 0}
        onIniciar={iniciarPartida}
        iniciada={Boolean(partida)}
      />

      {!partida && <TelaInicial onIniciar={iniciarPartida} />}

      {partida && (
        <main className="mt-6 flex flex-1 flex-col gap-6">
          <StatusTurno
            vezDoJogador={vezDoJogador}
            processando={processando}
            finalizada={finalizada}
            vencedorNome={vencedor?.nome ?? null}
          />

          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
            {/* IA */}
            <AreaJogador titulo={ia?.nome ?? 'Computador'} cartas={ia?.cartas.length ?? 0}>
              <Carta carta={cartaIA} revelada={revelarIA} />
            </AreaJogador>

            {/* Centro: monte + resultado */}
            <CentroMesa
              monte={partida.monte.length}
              resultado={ultimoResultado?.motivo ?? null}
            />

            {/* Jogador */}
            <AreaJogador titulo={jogador?.nome ?? 'Você'} cartas={jogador?.cartas.length ?? 0}>
              <Carta
                carta={cartaJogador}
                revelada
                interativa={vezDoJogador}
                atributoDestaque={atributoDestaque}
                onEscolherAtributo={(attr: Atributo) => jogarAtributo(attr)}
              />
            </AreaJogador>
          </div>

          <Historico
            entradas={
              partida.historico.map((r) => ({
                atributo: r.atributo,
                empate: r.empate,
                vencedorId: r.vencedorId,
                motivo: r.motivo,
              }))
            }
            nomePorId={(id) =>
              partida.jogadores.find((j) => j.id === id)?.nome ?? id
            }
          />
        </main>
      )}
    </div>
  );
}

function Header({
  rodada,
  emJogo,
  cartasJogador,
  cartasIA,
  onIniciar,
  iniciada,
}: {
  rodada: number;
  emJogo: boolean;
  cartasJogador: number;
  cartasIA: number;
  onIniciar: () => void;
  iniciada: boolean;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🌿</span>
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-hemp-200">
            Hemp Trunfo
          </h1>
          {emJogo && (
            <p className="text-sm text-hemp-300">
              Rodada {rodada} · Você {cartasJogador} × {cartasIA} CPU
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onIniciar}
        className="rounded-xl bg-hemp-500 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-hemp-400 active:scale-95"
      >
        {iniciada ? 'Reiniciar' : 'Iniciar partida'}
      </button>
    </header>
  );
}

function TelaInicial({ onIniciar }: { onIniciar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
      <span className="text-8xl">🍃</span>
      <h2 className="max-w-xl font-display text-4xl uppercase leading-tight text-hemp-100">
        O Super Trunfo das genéticas
      </h2>
      <p className="max-w-md text-hemp-300">
        Escolha o atributo da sua carta, supere o oponente e conquiste todas as
        cartas. Maior valor vence. Empate vai para o monte. Vantagem sempre
        vence; Revés sempre perde.
      </p>
      <button
        type="button"
        onClick={onIniciar}
        className="rounded-2xl bg-hemp-500 px-8 py-3 text-lg font-bold text-white shadow-xl transition hover:bg-hemp-400 active:scale-95"
      >
        Começar a jogar
      </button>
    </div>
  );
}

function StatusTurno({
  vezDoJogador,
  processando,
  finalizada,
  vencedorNome,
}: {
  vezDoJogador: boolean;
  processando: boolean;
  finalizada: boolean;
  vencedorNome: string | null;
}) {
  let texto: string;
  let cor: string;

  if (finalizada) {
    texto = `Fim de jogo! ${vencedorNome} venceu a partida 🏆`;
    cor = 'bg-amber-500/20 text-amber-200 ring-amber-400/40';
  } else if (vezDoJogador) {
    texto = 'Sua vez: escolha um atributo na sua carta.';
    cor = 'bg-hemp-500/20 text-hemp-100 ring-hemp-400/40';
  } else if (processando) {
    texto = 'Computador está pensando...';
    cor = 'bg-sky-500/20 text-sky-100 ring-sky-400/40';
  } else {
    texto = 'Aguardando...';
    cor = 'bg-white/10 text-white/70 ring-white/20';
  }

  return (
    <div
      className={`mx-auto rounded-full px-5 py-2 text-sm font-semibold ring-1 ${cor}`}
    >
      {texto}
    </div>
  );
}

function AreaJogador({
  titulo,
  cartas,
  children,
}: {
  titulo: string;
  cartas: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 rounded-full bg-hemp-900/60 px-4 py-1.5">
        <span className="font-semibold text-hemp-100">{titulo}</span>
        <span className="rounded-full bg-hemp-600 px-2 py-0.5 text-xs font-bold text-white">
          {cartas} cartas
        </span>
      </div>
      {children}
    </section>
  );
}

function CentroMesa({
  monte,
  resultado,
}: {
  monte: number;
  resultado: string | null;
}) {
  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4 lg:self-center">
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-hemp-900/60 px-6 py-4">
        <span className="text-3xl">🃏</span>
        <span className="text-xs uppercase tracking-widest text-hemp-300">
          Monte de empate
        </span>
        <span className="font-display text-2xl text-hemp-100">{monte}</span>
      </div>

      <AnimatePresence mode="wait">
        {resultado && (
          <motion.div
            key={resultado}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl bg-black/30 px-4 py-3 text-center text-sm text-hemp-100"
          >
            {resultado}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EntradaHistorico {
  atributo: Atributo | null;
  empate: boolean;
  vencedorId: string | null;
  motivo: string;
}

function Historico({
  entradas,
  nomePorId,
}: {
  entradas: EntradaHistorico[];
  nomePorId: (id: string) => string;
}) {
  if (entradas.length === 0) return null;
  const recentes = [...entradas].reverse().slice(0, 6);

  return (
    <section className="mt-2">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-hemp-300">
        Histórico
      </h3>
      <ul className="flex flex-col gap-1.5">
        {recentes.map((e, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-lg bg-hemp-900/40 px-3 py-2 text-sm"
          >
            <span className="rounded bg-hemp-700 px-2 py-0.5 text-xs font-semibold text-hemp-100">
              {e.atributo ? ATRIBUTO_LABEL[e.atributo] : 'Especial'}
            </span>
            <span className="text-hemp-200">
              {e.empate
                ? 'Empate → monte'
                : `Vitória de ${nomePorId(e.vencedorId ?? '')}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
