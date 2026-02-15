import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Sentra" className="w-8 h-8" />
              <span className="text-lg font-bold text-white">Sentra</span>
            </div>
            <p className="text-slate-400 text-sm">
              Intelligent fraud detection platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">Features</Link></li>
              <li><a href="/#pricing" className="hover:text-sky-400 transition-colors cursor-pointer">Pricing</a></li>
              <li><a href="/#how-it-works" className="hover:text-sky-400 transition-colors cursor-pointer">How It Works</a></li>
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Blog</a></li>
              <li><Link to="/careers" className="hover:text-sky-400 transition-colors">Careers</Link></li>
              <li><a href="/#contact" className="hover:text-sky-400 transition-colors cursor-pointer">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Security</a></li>
              <li><a href="/#" className="hover:text-sky-400 transition-colors cursor-pointer">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 py-8">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span>📍 Nairobi, Kenya</span>
              </div>
              <a href="mailto:meshacknjorogeg@gmail.com" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                <Mail size={16} />
                meshacknjorogeg@gmail.com
              </a>
              <a href="tel:+254798779172" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                <Phone size={16} />
                +254 798 779 172
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>
              © {currentYear} Sentra. All rights reserved.
            </p>
            <p>
              Intelligent fraud detection platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
