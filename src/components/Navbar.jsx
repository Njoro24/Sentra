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
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (href) => {
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/95 backdrop-blur-md border-b border-indigo-500/20 shadow-lg shadow-indigo-500/10' 
        : 'bg-slate-950/50 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.svg" alt="Sentra" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">Sentra</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-medium cursor-pointer bg-none border-none relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-indigo-500/20">
              <a
                href="/login"
                className="px-4 py-2 text-indigo-300 hover:text-indigo-200 transition-colors text-sm font-medium"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all cursor-pointer border-none font-medium"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-indigo-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all bg-none border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-2 border-t border-indigo-500/10 mt-2 space-y-2">
              <a
                href="/login"
                className="block w-full px-4 py-2 text-indigo-300 hover:text-indigo-200 transition-colors text-sm font-medium text-center"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="block w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-center border-none cursor-pointer font-medium hover:shadow-lg hover:shadow-indigo-500/50"
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
