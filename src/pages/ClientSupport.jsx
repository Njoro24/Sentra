import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, MessageCircle, Send, Plus } from 'lucide-react'
import ClientLayout from '../components/ClientLayout'

export default function ClientSupport() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('faq')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  })
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! How can we help?' }
  ])

  const [tickets] = useState([
    { id: 'TKT-0003', subject: 'API rate limit issue', status: 'Resolved', created: 'Feb 25' },
    { id: 'TKT-0002', subject: 'Need OAuth2 support', status: 'In Progress', created: 'Feb 20' },
    { id: 'TKT-0001', subject: 'Integration help', status: 'Resolved', created: 'Feb 10' }
  ])

  const faqs = [
    {
      question: 'How do I interpret the risk scores?',
      answer: 'Risk scores range from 0.0 to 1.0:\n- 0.0-0.4 (LOW): Approve transaction\n- 0.4-0.7 (MEDIUM): Review or request verification\n- 0.7-1.0 (HIGH): Block transaction'
    },
    {
      question: 'What does each signal mean?',
      answer: 'Key signals include:\n- Velocity Spike: Multiple transactions in short time\n- Amount Anomaly: Larger than usual for this customer\n- New Device: First time using this device\n- Location Change: Different country from usual'
    },
    {
      question: 'Can I override the fraud decision?',
      answer: 'Yes! If you believe we blocked a legitimate transaction:\n1. Go to Transactions page\n2. Click the transaction\n3. Click "Report as False Positive"\n4. Tell us why it was legitimate\n5. We improve our system based on your feedback'
    },
    {
      question: 'How often is the model updated?',
      answer: 'Our fraud detection model is retrained weekly with:\n- New fraud patterns we\'ve discovered\n- Your feedback on false positives\n- Global fraud trend data'
    }
  ]

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: chatMessage }])
      setChatMessage('')
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: 'Thanks for your message. Our team will respond shortly.' }])
      }, 500)
    }
  }

  const handleSubmitTicket = () => {
    if (ticketForm.subject && ticketForm.category && ticketForm.description) {
      alert('Ticket submitted successfully!')
      setTicketForm({ subject: '', category: '', priority: 'medium', description: '' })
    }
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading support...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'faq'
              ? 'text-cyan-400 border-cyan-500'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-4 h-4 inline mr-2" />
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'tickets'
              ? 'text-cyan-400 border-cyan-500'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Support Tickets
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'chat'
              ? 'text-cyan-400 border-cyan-500'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Live Chat
        </button>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition"
              >
                <p className="text-white font-medium text-left">{faq.question}</p>
                <span className={`text-cyan-400 transition ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedFaq === idx && (
                <div className="px-6 py-4 border-t border-white/10 bg-slate-800/50">
                  <p className="text-slate-300 whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create Ticket */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Create a Support Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Subject</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select Category</option>
                  <option value="api">API Integration</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={ticketForm.priority === p}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300 capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Description</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Tell us what's wrong or what you need help with..."
                  rows="5"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleSubmitTicket}
                className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition font-medium"
              >
                Submit Ticket
              </button>
            </div>
          </div>

          {/* Ticket History */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{ticket.subject}</p>
                      <p className="text-xs text-slate-400 mt-1">{ticket.id} • {ticket.created}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'Resolved'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <button className="text-cyan-400 hover:text-cyan-300 transition text-sm font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-96">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-white/10 p-4 bg-slate-800/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Response time: &lt; 5 minutes | Hours: 9 AM - 6 PM (EAT)</p>
          </div>
        </div>
      )}
    </ClientLayout>
  )
}
