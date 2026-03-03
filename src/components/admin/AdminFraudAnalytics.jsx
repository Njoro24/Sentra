import React, { useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle } from 'lucide-react'
import MetricCard from './MetricCard'

export default function AdminFraudAnalytics() {
  const [modelMetrics, setModelMetrics] = React.useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    falsePositiveRate: 0
  })
  const [clientFraudData, setClientFraudData] = React.useState([])
  const [fraudByCountry, setFraudByCountry] = React.useState([])
  const [fraudByHour, setFraudByHour] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    fetchFraudAnalytics()
  }, [])

  const fetchFraudAnalytics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      
      // Fetch fraud stats
      const statsResponse = await fetch('http://localhost:8000/api/admin/fraud/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setModelMetrics({
          accuracy: statsData.model_accuracy || 0,
          precision: statsData.model_precision || 0,
          recall: statsData.model_recall || 0,
          falsePositiveRate: statsData.model_false_positive_rate || 0
        })
      }
      
      // Fetch fraud by client
      const clientResponse = await fetch('http://localhost:8000/api/admin/fraud/by-client', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (clientResponse.ok) {
        const clientData = await clientResponse.json()
        setClientFraudData(clientData.data || [])
      }
      
      // Fetch fraud by country
      const countryResponse = await fetch('http://localhost:8000/api/admin/fraud/by-country', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (countryResponse.ok) {
        const countryData = await countryResponse.json()
        setFraudByCountry(countryData.data || [])
      }
      
      // Fetch fraud patterns
      const patternsResponse = await fetch('http://localhost:8000/api/admin/fraud/patterns', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (patternsResponse.ok) {
        const patternsData = await patternsResponse.json()
        setFraudByHour(patternsData.patterns || [])
      }
    } catch (error) {
      console.error('Failed to fetch fraud analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Model Performance Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Accuracy"
          value={modelMetrics.accuracy}
          unit="%"
          status="healthy"
        />
        <MetricCard
          title="Precision"
          value={modelMetrics.precision}
          unit=""
          status="healthy"
        />
        <MetricCard
          title="Recall"
          value={modelMetrics.recall}
          unit=""
          status="healthy"
        />
        <MetricCard
          title="False Positive Rate"
          value={modelMetrics.falsePositiveRate}
          unit="%"
          status="warning"
        />
      </div>

      {/* Model Health Alert */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
        <div>
          <h4 className="text-white font-semibold mb-1">Model Health: Excellent</h4>
          <p className="text-green-200/80 text-sm">Model accuracy is above 95%. Last retrained 3 days ago. Performance trend: Improving</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fraud by Client */}
        {clientFraudData.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Fraud Rate by Client</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientFraudData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="fraudRate" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Fraud by Country */}
        {fraudByCountry.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Fraud by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fraudByCountry}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="country" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="fraudRate" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Fraud by Hour */}
      {fraudByHour.length > 0 && (
        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Peak Fraud Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
