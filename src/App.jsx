import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Hero from './pages/Hero'
import About from './pages/About'
import Publications from './pages/Publications'
import Projects from './pages/Projects'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isScrolled={isScrolled} />
      <main>
        <Hero />
        <About />
        <Publications />
        <Projects />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
