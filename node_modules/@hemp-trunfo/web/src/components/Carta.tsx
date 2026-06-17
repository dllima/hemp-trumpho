import { motion } from 'framer-motion';
import {
  ATRIBUTOS,
  ATRIBUTO_LABEL,
  type Atributo,
  type Carta as CartaTipo,
} from '@hemp-trunfo/engine';

interface CartaProps {
  carta: CartaTipo | null;
  /** Mostra a frente da carta? Se false, exibe o verso. */
  revelada: boolean;
  /** Atributos clicáveis (turno do dono da carta). */
  interativa?: boolean;
  /** Atributo escolhido na rodada (destaca). */
  atributoDestaque?: Atributo | null;
  onEscolherAtributo?: (atributo: Atributo) => void;
}

const corEspecial: Record<string, string> = {
  vantagem: 'from-emerald-500 to-green-700 border-emerald-300',
  reves: 'from-rose-600 to-red-800 border-rose-400',
  informativa: 'from-sky-600 to-blue-800 border-sky-400',
  regras: 'from-amber-500 to-orange-700 border-amber-300',
};

export default function Carta({
  carta,
  revelada,
  interativa = false,
  atributoDestaque = null,
  onEscolherAtributo,
}: CartaProps) {
  return (
    <div className="[perspective:1200px]">
      <motion.div
        className="relative h-[420px] w-[300px] rounded-2xl [transform-style:preserve-3d]"
        animate={{ rotateY: revelada ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Frente */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {carta ? (
            <FrenteCarta
              carta={carta}
              interativa={interativa}
              atributoDestaque={atributoDestaque}
              onEscolherAtributo={onEscolherAtributo}
            />
          ) : (
            <CartaVazia />
          )}
        </div>

        {/* Verso */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <VersoCarta />
        </div>
      </motion.div>
    </div>
  );
}

function FrenteCarta({
  carta,
  interativa,
  atributoDestaque,
  onEscolherAtributo,
}: {
  carta: CartaTipo;
  interativa: boolean;
  atributoDestaque: Atributo | null;
  onEscolherAtributo?: (atributo: Atributo) => void;
}) {
  if (carta.tipo !== 'genetica') {
    const cor = corEspecial[carta.tipo] ?? 'from-hemp-500 to-hemp-800 border-hemp-300';
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border-4 bg-gradient-to-br ${cor} p-6 text-center shadow-2xl`}
      >
        <span className="text-6xl">
          {carta.tipo === 'vantagem' ? '⭐' : carta.tipo === 'reves' ? '💀' : 'ℹ️'}
        </span>
        <h3 className="font-display text-3xl uppercase tracking-wide text-white drop-shadow">
          {carta.nome}
        </h3>
        <p className="text-sm leading-relaxed text-white/90">{carta.descricao}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border-4 border-hemp-300 bg-gradient-to-br from-hemp-100 to-hemp-300 p-3 text-hemp-950 shadow-2xl">
      <div className="flex items-center justify-between rounded-xl bg-hemp-800 px-3 py-2 text-hemp-50">
        <div>
          <h3 className="font-display text-lg leading-tight">{carta.nome}</h3>
          <p className="text-[11px] uppercase tracking-widest text-hemp-200">
            {carta.linhagem}
          </p>
        </div>
        <span className="text-3xl">🌿</span>
      </div>

      <p className="mt-2 px-1 text-[11px] italic text-hemp-700">
        {carta.descricao}
      </p>

      <ul className="mt-2 flex flex-1 flex-col gap-1">
        {ATRIBUTOS.map((attr) => {
          const valor = carta.atributos[attr];
          const destaque = atributoDestaque === attr;
          const base =
            'flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-semibold transition';
          const estado = destaque
            ? 'bg-hemp-700 text-white ring-2 ring-amber-300'
            : 'bg-white/70 text-hemp-900';
          const clicavel = interativa
            ? 'cursor-pointer hover:bg-hemp-600 hover:text-white'
            : 'cursor-default';
          return (
            <li key={attr}>
              <button
                type="button"
                disabled={!interativa}
                onClick={() => interativa && onEscolherAtributo?.(attr)}
                className={`w-full ${base} ${estado} ${clicavel}`}
              >
                <span>{ATRIBUTO_LABEL[attr]}</span>
                <span className="tabular-nums">{valor}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function VersoCarta() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-4 border-hemp-400 bg-gradient-to-br from-hemp-700 to-hemp-950 shadow-2xl">
      <span className="text-7xl">🍃</span>
      <span className="font-display text-2xl uppercase tracking-widest text-hemp-200">
        Hemp Trunfo
      </span>
    </div>
  );
}

function CartaVazia() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border-4 border-dashed border-hemp-600 bg-hemp-900/40 text-hemp-400">
      Sem carta
    </div>
  );
}
