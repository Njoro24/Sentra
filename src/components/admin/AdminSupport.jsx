import React, { useState } from 'react'
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminSupport() {
  const [tickets, setTickets] = useState([])

  const stats = {
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    avgResponseTime: '2.5 hours',
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-red-500/20 text-red-200'
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-200'
      case 'closed': return 'bg-green-500/20 text-green-200'
      default: return 'bg-gray-500/20 text-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-white'
    }
  }

  return (
    <div className="space-y-6">
      {tickets.length > 0 ? (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-200 text-sm mb-2">Open Tickets</div>
              <div className="text-2xl font-bold text-red-400">{tickets.filter(t => t.status === 'open').length}</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-yellow-200 text-sm mb-2">In Progress</div>
              <div className="text-2xl font-bold text-yellow-400">{tickets.filter(t => t.status === 'in-progress').length}</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-200 text-sm mb-2">Closed</div>
              <div className="text-2xl font-bold text-green-400">{tickets.filter(t => t.status === 'closed').length}</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-2">Avg Response Time</div>
              <div className="text-2xl font-bold text-white">--</div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne' }}>Support Tickets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Client</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Subject</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Priority</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Responses</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Created</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white text-sm">{ticket.client}</td>
                      <td className="px-6 py-4 text-white text-sm">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium text-sm ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">{ticket.responses}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{ticket.created}</td>
                      <td className="px-6 py-4">
                        <button className="text-white/70 hover:text-white transition-colors text-sm">
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-white/70">Waiting for support tickets from backend...</p>
        </div>
      )}
    </div>
  )
}
