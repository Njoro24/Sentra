import React from 'react'

export default function FuturisticLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #071e52 0%, #0f4db5 55%, #2277ee 100%)' }}>
      <div className="relative w-32 h-32">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#7ab8f5] border-r-[#7ab8f5] animate-spin" style={{ animationDuration: '2s' }}></div>

        {/* Middle rotating ring */}
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-[#2277ee] border-l-[#2277ee] animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>

        {/* Inner rotating ring */}
        <div className="absolute inset-8 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin" style={{ animationDuration: '1.5s' }}></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-20 text-center">
        <p className="text-white text-sm font-medium tracking-widest" style={{ fontFamily: 'Syne' }}>
          INITIALIZING SENTRA
        </p>
        <div className="flex gap-1 justify-center mt-3">
          <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  )
}
