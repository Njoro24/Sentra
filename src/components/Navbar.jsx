import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
  ]

  const handleNavClick = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/70 backdrop-blur-md border-b border-blue-200/30 shadow-lg shadow-blue-500/10' 
        : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.svg" alt="Sentra" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold text-[#071e52] hidden sm:inline group-hover:text-[#2277ee] transition-all" style={{ fontFamily: 'Syne' }}>Sentra</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id)}
                className="text-[#071e52] hover:text-[#2277ee] transition-colors text-sm font-medium cursor-pointer bg-none border-none relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2277ee] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <div className="flex items-center gap-2 ml-8 pl-8 border-l border-blue-200/30">
              <a
                href="/login"
                className="px-4 py-2 text-[#2277ee] hover:text-[#071e52] rounded-lg hover:bg-blue-100/30 transition-all cursor-pointer border-none font-medium whitespace-nowrap"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-6 py-2 bg-[#2277ee] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all cursor-pointer border-none font-medium hover:bg-[#071e52] whitespace-nowrap"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#071e52] hover:text-[#2277ee] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-blue-200/30 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id)}
                className="block w-full text-left px-4 py-2 text-[#071e52] hover:text-[#2277ee] hover:bg-blue-100/30 transition-all bg-none border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-2 border-t border-blue-200/30 mt-2 space-y-2">
              <a
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-[#2277ee] rounded-lg text-center border-none cursor-pointer font-medium hover:bg-blue-100/30"
              >
                Sign In
              </a>
              <a
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 bg-[#2277ee] text-white rounded-lg text-center border-none cursor-pointer font-medium hover:shadow-lg hover:shadow-blue-500/50 hover:bg-[#071e52]"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
