import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
  }

  return (
    <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Sentra" className="w-8 h-8" />
            <span className="text-xl font-bold text-white hidden sm:inline">Sentra</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium cursor-pointer bg-none border-none"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#contact')}
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-sky-500/50 transition-all cursor-pointer border-none"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavClick(link.href)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-sky-400 transition-colors bg-none border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleNavClick('#contact')
                setIsOpen(false)
              }}
              className="block w-full mx-4 mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-center border-none cursor-pointer"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
