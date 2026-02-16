import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Careers from './pages/Careers'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DashboardLiveFeed from './pages/DashboardLiveFeed'
import DashboardAnalytics from './pages/DashboardAnalytics'
import DashboardInvestigations from './pages/DashboardInvestigations'
import DashboardSettings from './pages/DashboardSettings'

function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/feed" element={
        <ProtectedRoute>
          <DashboardLiveFeed />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/analytics" element={
        <ProtectedRoute>
          <DashboardAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/investigations" element={
        <ProtectedRoute>
          <DashboardInvestigations />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/settings" element={
        <ProtectedRoute>
          <DashboardSettings />
        </ProtectedRoute>
      } />
      <Route path="/careers" element={<Careers />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
