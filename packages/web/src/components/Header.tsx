import { useState, useEffect } from 'react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'h-14 bg-[#0a4d3c]/95 backdrop-blur-md shadow-lg'
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="h-full flex items-center justify-center px-4">
        <img
          src="/logo-hemp-trumpho.png"
          alt="Hemp Trumpho"
          className={`transition-all duration-300 ease-out ${
            scrolled ? 'h-8' : 'h-12'
          }`}
        />
      </div>
    </header>
  )
}
