import { useState, useEffect } from 'react'

// Chuva de confete (50 peças coloridas). Usa a animação `.confetti` do index.css.
// Extraído da Mesa para ser reusado tanto no clímax de VANTAGEM quanto na tela
// de fim (só na vitória).
export function Confetti() {
  const [pieces, setPieces] = useState<number[]>([])

  useEffect(() => {
    const p = Array.from({ length: 50 }, (_, i) => i)
    setPieces(p)
  }, [])

  const colors = ['#c9a227', '#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6']

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${5 + Math.random() * 10}px`,
            height: `${5 + Math.random() * 10}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}
