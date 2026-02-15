import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="text-sky-400 hover:text-sky-300 mb-8 cursor-pointer bg-none border-none text-lg"
          >
            ← Back
          </button>

          <h1 className="text-5xl font-bold text-white mb-8">About Sentra</h1>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                Sentra is an intelligent fraud detection platform designed to protect financial institutions from fraud at scale. We use advanced machine learning to analyze transactions in real-time, providing institutions with the insights they need to protect their customers and reduce losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
              <p className="text-lg leading-relaxed mb-4">
                We provide real-time fraud detection powered by machine learning. Every transaction is scored instantly, giving you the insights you need to make informed decisions about fraud risk.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-sky-400">✓</span>
                  <span>Real-time transaction scoring with sub-200ms response times</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">✓</span>
                  <span>Machine learning models trained on fraud patterns</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">✓</span>
                  <span>Network analysis to detect fraud rings and coordinated attacks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">✓</span>
                  <span>Detailed signal breakdown explaining each risk score</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">✓</span>
                  <span>Enterprise-grade security and compliance</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-sky-400">→</span>
                  <span>Detect fraud before it happens with intelligent ML models</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">→</span>
                  <span>Reduce false positives and improve customer experience</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">→</span>
                  <span>Understand exactly why transactions are flagged</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">→</span>
                  <span>Scale to millions of transactions per day</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400">→</span>
                  <span>Enterprise security and compliance ready</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Our Technology</h2>
              <p className="text-lg leading-relaxed">
                We use state-of-the-art machine learning, real-time data processing, and graph analysis to detect fraud patterns that traditional systems miss. Our platform is built for scale, security, and reliability.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
