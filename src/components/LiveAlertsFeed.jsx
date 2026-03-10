/**
 * ════════════════════════════════════════════════════════════════════════════════
 * LIVE ALERTS FEED COMPONENT
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * Real-time fraud alert feed using WebSocket connection.
 * Displays incoming fraud alerts with risk scores and signals.
 * 
 * ════════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';

export function LiveAlertsFeed() {
  const [clientId, setClientId] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isConnected, alerts, stats, clearAlerts } = useWebSocket(clientId, apiKey);

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setClientId(user.id);
        setApiKey(user.api_key);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="live-feed-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-feed-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="live-feed-container">
      {/* Header */}
      <div className="feed-header">
        <div className="header-title">
          <h2>Live Fraud Alerts</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="header-stats">
          <div className="stat">
            <span className="label">Alerts Received:</span>
            <span className="value">{stats.messagesReceived}</span>
          </div>
          <div className="stat">
            <span className="label">Last Alert:</span>
            <span className="value">
              {stats.lastMessageTime
                ? new Date(stats.lastMessageTime).toLocaleTimeString()
                : 'None'}
            </span>
          </div>
          <button className="btn-clear" onClick={clearAlerts}>
            Clear Feed
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <p>No fraud alerts yet</p>
            <p className="subtitle">Alerts will appear here in real-time</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <AlertCard key={`${alert.transaction_id}-${index}`} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Individual alert card component
 */
function AlertCard({ alert }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const getRiskColor = (score) => {
    if (score >= 70) return '#e8312a'; // Red
    if (score >= 40) return '#ff7a2a'; // Orange
    return '#00c97a'; // Green
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      'BLOCK': { color: '#e8312a', label: 'BLOCK' },
      'FLAG': { color: '#ff7a2a', label: 'FLAG' },
      'APPROVE': { color: '#00c97a', label: 'APPROVE' }
    };
    return badges[recommendation] || badges['APPROVE'];
  };

  const handleFeedback = async (status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${apiUrl}/alerts/${alert.transaction_id}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            marked_status: status,
            analyst_notes: notes || null
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFeedback(status);
        setShowNotes(false);
        setNotes('');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const badge = getRecommendationBadge(alert.recommendation);
  const riskColor = getRiskColor(alert.risk_score);

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div className="alert-id">
          <span className="label">Transaction:</span>
          <span className="value">{alert.transaction_id.substring(0, 8)}...</span>
        </div>
        <div className="alert-time">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="alert-body">
        <div className="risk-section">
          <div className="risk-score" style={{ borderColor: riskColor }}>
            <span className="score" style={{ color: riskColor }}>
              {alert.risk_score}
            </span>
            <span className="label">Risk Score</span>
          </div>

          <div className="risk-level">
            <span className="label">Level:</span>
            <span className="value" style={{ color: riskColor }}>
              {alert.risk_level}
            </span>
          </div>

          <div className="recommendation">
            <span
              className="badge"
              style={{ backgroundColor: badge.color }}
            >
              {badge.label}
            </span>
          </div>
        </div>

        <div className="transaction-details">
          <div className="detail">
            <span className="label">Amount:</span>
            <span className="value">KES {alert.amount?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="detail">
            <span className="label">Phone:</span>
            <span className="value">{alert.phone_number || 'N/A'}</span>
          </div>
          <div className="detail">
            <span className="label">Location:</span>
            <span className="value">{alert.location || 'N/A'}</span>
          </div>
        </div>

        {alert.velocity_info && (
          <div className="velocity-info">
            <span className="label">Velocity Spike:</span>
            <span className="value">
              {alert.velocity_info.transaction_count}/{alert.velocity_info.threshold} tx
              ({alert.velocity_info.severity})
            </span>
          </div>
        )}

        {alert.signals && (
          <div className="signals">
            <span className="label">Signals:</span>
            <div className="signal-list">
              {Object.entries(alert.signals).map(([key, value]) => (
                <div key={key} className="signal">
                  <span className="signal-name">{key}:</span>
                  <span className="signal-value">{value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="feedback-section">
          {feedback ? (
            <div className={`feedback-status feedback-${feedback}`}>
              <span className="status-icon">✓</span>
              <span className="status-text">Marked as {feedback.toUpperCase()}</span>
            </div>
          ) : (
            <>
              <div className="feedback-buttons">
                <button
                  className="btn-feedback btn-correct"
                  onClick={() => handleFeedback('correct')}
                  disabled={loading}
                >
                  ✓ Correct
                </button>
                <button
                  className="btn-feedback btn-incorrect"
                  onClick={() => handleFeedback('incorrect')}
                  disabled={loading}
                >
                  ✗ Incorrect
                </button>
                <button
                  className="btn-feedback btn-escalate"
                  onClick={() => handleFeedback('escalate')}
                  disabled={loading}
                >
                  ⚠ Escalate
                </button>
              </div>
              <button
                className="btn-notes"
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? 'Hide Notes' : 'Add Notes'}
              </button>
            </>
          )}

          {showNotes && !feedback && (
            <textarea
              className="notes-input"
              placeholder="Add analyst notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────

const styles = `
.live-feed-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #080c14;
  color: #f0f4ff;
  font-family: 'DM Sans', sans-serif;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #1e2d4a;
  background: #0d1829;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.connection-status.connected {
  background: rgba(0, 201, 122, 0.1);
  color: #00c97a;
  border: 1px solid rgba(0, 201, 122, 0.3);
}

.connection-status.disconnected {
  background: rgba(232, 49, 42, 0.1);
  color: #e8312a;
  border: 1px solid rgba(232, 49, 42, 0.3);
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat .label {
  font-size: 11px;
  color: #4a5a7a;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.stat .value {
  font-size: 18px;
  font-weight: 700;
  color: #00d4ff;
}

.btn-clear {
  padding: 8px 16px;
  background: #1a3a6e;
  border: 1px solid #00d4ff;
  color: #00d4ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #00d4ff;
  color: #080c14;
}

.alerts-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4a5a7a;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.empty-state .subtitle {
  font-size: 14px;
  margin-top: 8px;
}

.alert-card {
  background: #0d1829;
  border: 1px solid #1e2d4a;
  border-radius: 6px;
  padding: 16px;
  transition: all 0.2s;
}

.alert-card:hover {
  border-color: #00d4ff;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.1);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #1e2d4a;
}

.alert-id {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.alert-id .label {
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.alert-id .value {
  color: #00d4ff;
  font-family: 'DM Mono', monospace;
  font-weight: 600;
}

.alert-time {
  font-size: 12px;
  color: #4a5a7a;
}

.alert-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.risk-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 2px solid;
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.05);
}

.risk-score .score {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.risk-score .label {
  font-size: 10px;
  color: #4a5a7a;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.risk-level {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.risk-level .label {
  font-size: 11px;
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.risk-level .value {
  font-size: 16px;
  font-weight: 700;
}

.recommendation {
  margin-left: auto;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.transaction-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  background: rgba(0, 212, 255, 0.05);
  border-radius: 4px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail .label {
  font-size: 11px;
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail .value {
  font-size: 13px;
  color: #f0f4ff;
  word-break: break-all;
}

.velocity-info {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 122, 42, 0.1);
  border: 1px solid rgba(255, 122, 42, 0.3);
  border-radius: 4px;
  font-size: 12px;
}

.velocity-info .label {
  color: #ff7a2a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.velocity-info .value {
  color: #ff7a2a;
}

.signals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.signals .label {
  font-size: 11px;
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.signal-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.signal {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(0, 212, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.signal-name {
  font-size: 10px;
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.signal-value {
  font-size: 12px;
  color: #00d4ff;
  font-weight: 600;
  font-family: 'DM Mono', monospace;
}

.feedback-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 4px;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
}

.btn-feedback {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-correct {
  background: rgba(0, 201, 122, 0.1);
  border-color: #00c97a;
  color: #00c97a;
}

.btn-correct:hover:not(:disabled) {
  background: #00c97a;
  color: #080c14;
}

.btn-incorrect {
  background: rgba(232, 49, 42, 0.1);
  border-color: #e8312a;
  color: #e8312a;
}

.btn-incorrect:hover:not(:disabled) {
  background: #e8312a;
  color: #f0f4ff;
}

.btn-escalate {
  background: rgba(255, 122, 42, 0.1);
  border-color: #ff7a2a;
  color: #ff7a2a;
}

.btn-escalate:hover:not(:disabled) {
  background: #ff7a2a;
  color: #080c14;
}

.btn-feedback:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-notes {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #4a5a7a;
  color: #4a5a7a;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-notes:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}

.notes-input {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 4px;
  color: #f0f4ff;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  resize: vertical;
}

.notes-input::placeholder {
  color: #4a5a7a;
}

.feedback-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.feedback-correct {
  background: rgba(0, 201, 122, 0.1);
  border: 1px solid rgba(0, 201, 122, 0.3);
  color: #00c97a;
}

.feedback-incorrect {
  background: rgba(232, 49, 42, 0.1);
  border: 1px solid rgba(232, 49, 42, 0.3);
  color: #e8312a;
}

.feedback-escalate {
  background: rgba(255, 122, 42, 0.1);
  border: 1px solid rgba(255, 122, 42, 0.3);
  color: #ff7a2a;
}

.status-icon {
  font-size: 14px;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
}

.error {
  color: #e8312a;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default LiveAlertsFeed;
