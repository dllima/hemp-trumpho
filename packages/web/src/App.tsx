import { Header } from './components/Header'
import { Mesa } from './components/Mesa'
import { useJogoStore } from './store/jogoStore'

function App() {
  // Mesmo estado que a Mesa usa para decidir Home vs jogo (useJogoStore.partida).
  const partida = useJogoStore(s => s.partida)

  // Sem partida = Home (landing tela cheia): sem o Header global e sem o pt-20,
  // pois a Home tem header próprio (.site-header) e pinta o fundo inteiro.
  if (!partida) {
    return <Mesa />
  }

  // Com partida (jogo ativo / fim de jogo): mantém o Header global fixo + o
  // padding para o conteúdo não ficar sob o logo.
  return (
    <>
      <Header />
      {/* pt-20 = altura do header (h-20) para o conteúdo não ficar sob o logo fixo */}
      <div className="pt-20">
        <Mesa />
      </div>
    </>
  )
}

export default App
