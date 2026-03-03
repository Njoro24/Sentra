import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Careers() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #071e52 0%, #0f4db5 55%, #2277ee 100%)' }}>
      <Navbar />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="text-[#7ab8f5] hover:text-[#2277ee] mb-8 cursor-pointer bg-none border-none text-lg transition-colors"
          >
            ← Back
          </button>

          <h1 className="text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Syne' }}>Careers</h1>

          <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-12 text-center hover:border-indigo-500/50 transition-all">
            <p className="text-xl text-slate-300 mb-4">
              No open positions at the moment
            </p>
            <p className="text-slate-400">
              Check back later for exciting opportunities to join our team
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
