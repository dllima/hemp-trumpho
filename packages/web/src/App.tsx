import { Header } from './components/Header'
import { Mesa } from './components/Mesa'

function App() {
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
