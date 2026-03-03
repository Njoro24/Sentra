import React, { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminSystemHealth from '../components/admin/AdminSystemHealth'
import AdminDailyMetrics from '../components/admin/AdminDailyMetrics'
import AdminClientManagement from '../components/admin/AdminClientManagement'
import AdminRevenueBilling from '../components/admin/AdminRevenueBilling'
import AdminFraudAnalytics from '../components/admin/AdminFraudAnalytics'
import AdminRealTimeMonitoring from '../components/admin/AdminRealTimeMonitoring'
import AdminSupport from '../components/admin/AdminSupport'
import AdminSettings from '../components/admin/AdminSettings'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function AdminDashboard() {
  useAdminAuth() // Ensure user is authenticated
  const [activeTab, setActiveTab] = useState('health')

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <AdminSystemHealth />
      case 'metrics':
        return <AdminDailyMetrics />
      case 'clients':
        return <AdminClientManagement />
      case 'revenue':
        return <AdminRevenueBilling />
      case 'fraud':
        return <AdminFraudAnalytics />
      case 'monitoring':
        return <AdminRealTimeMonitoring />
      case 'support':
        return <AdminSupport />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminSystemHealth />
    }
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  )
}
