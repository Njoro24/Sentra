import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', institution: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ready to protect your institution? Contact us today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                <a href="mailto:meshacknjorogeg@gmail.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                  meshacknjorogeg@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                <a href="tel:+254798779172" className="text-sky-400 hover:text-sky-300 transition-colors">
                  +254 798 779 172
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                <p className="text-slate-400">
                  Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg">
              <p className="text-sky-300 text-sm">
                <span className="font-semibold">Response Time:</span> We typically respond within 2 hours during business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                  placeholder="+254..."
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                  placeholder="Your bank or SACCO"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your fraud detection needs..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2 group cursor-pointer border-none"
              >
                Send Message
                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">
                    ✓ Message sent successfully! We'll be in touch soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
