import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

export function FeedbackSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbackStats();
    const interval = setInterval(fetchFeedbackStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchFeedbackStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/alerts/feedback/stats?days=30`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="feedback-summary">
        <div className="loading">Loading feedback stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="feedback-summary">
        <div className="empty">No feedback data yet</div>
      </div>
    );
  }

  return (
    <div className="feedback-summary">
      <div className="summary-header">
        <h3>Feedback Summary (Last 30 Days)</h3>
        <button className="btn-refresh" onClick={fetchFeedbackStats}>
          ↻ Refresh
        </button>
      </div>

      <div className="summary-grid">
        {/* Total Alerts */}
        <div className="summary-card">
          <div className="card-icon">
            <BarChart3 className="icon" />
          </div>
          <div className="card-content">
            <div className="card-label">Total Alerts Marked</div>
            <div className="card-value">{stats.total_alerts_marked}</div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="summary-card highlight">
          <div className="card-icon">
            <TrendingUp className="icon" />
          </div>
          <div className="card-content">
            <div className="card-label">Accuracy Rate</div>
            <div className="card-value">{stats.accuracy_percentage}%</div>
            <div className="card-subtitle">
              {stats.correct_count} correct out of {stats.total_alerts_marked}
            </div>
          </div>
        </div>

        {/* Correct */}
        <div className="summary-card success">
          <div className="card-icon">
            <CheckCircle className="icon" />
          </div>
          <div className="card-content">
            <div className="card-label">Correct</div>
            <div className="card-value">{stats.correct_count}</div>
            <div className="card-percentage">
              {stats.total_alerts_marked > 0
                ? ((stats.correct_count / stats.total_alerts_marked) * 100).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Incorrect */}
        <div className="summary-card warning">
          <div className="card-icon">
            <AlertCircle className="icon" />
          </div>
          <div className="card-content">
            <div className="card-label">Incorrect</div>
            <div className="card-value">{stats.incorrect_count}</div>
            <div className="card-percentage">
              {stats.total_alerts_marked > 0
                ? ((stats.incorrect_count / stats.total_alerts_marked) * 100).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Escalated */}
        <div className="summary-card info">
          <div className="card-icon">
            <AlertCircle className="icon" />
          </div>
          <div className="card-content">
            <div className="card-label">Escalated</div>
            <div className="card-value">{stats.escalate_count}</div>
            <div className="card-percentage">
              {stats.total_alerts_marked > 0
                ? ((stats.escalate_count / stats.total_alerts_marked) * 100).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Risk Level */}
      {Object.keys(stats.by_risk_level).length > 0 && (
        <div className="breakdown-section">
          <h4>Breakdown by Risk Level</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.by_risk_level).map(([level, data]) => (
              <div key={level} className="breakdown-card">
                <div className="breakdown-title">{level}</div>
                <div className="breakdown-stats">
                  <div className="stat">
                    <span className="label">Total:</span>
                    <span className="value">{data.total}</span>
                  </div>
                  <div className="stat correct">
                    <span className="label">✓ Correct:</span>
                    <span className="value">{data.correct}</span>
                  </div>
                  <div className="stat incorrect">
                    <span className="label">✗ Incorrect:</span>
                    <span className="value">{data.incorrect}</span>
                  </div>
                  <div className="stat escalate">
                    <span className="label">⚠ Escalate:</span>
                    <span className="value">{data.escalate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown by Recommendation */}
      {Object.keys(stats.by_recommendation).length > 0 && (
        <div className="breakdown-section">
          <h4>Breakdown by Recommendation</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.by_recommendation).map(([rec, data]) => (
              <div key={rec} className="breakdown-card">
                <div className="breakdown-title">{rec}</div>
                <div className="breakdown-stats">
                  <div className="stat">
                    <span className="label">Total:</span>
                    <span className="value">{data.total}</span>
                  </div>
                  <div className="stat correct">
                    <span className="label">✓ Correct:</span>
                    <span className="value">{data.correct}</span>
                  </div>
                  <div className="stat incorrect">
                    <span className="label">✗ Incorrect:</span>
                    <span className="value">{data.incorrect}</span>
                  </div>
                  <div className="stat escalate">
                    <span className="label">⚠ Escalate:</span>
                    <span className="value">{data.escalate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      {stats.recent_feedback && stats.recent_feedback.length > 0 && (
        <div className="recent-section">
          <h4>Recent Feedback</h4>
          <div className="recent-list">
            {stats.recent_feedback.map((item, idx) => (
              <div key={idx} className={`recent-item feedback-${item.marked_status}`}>
                <div className="item-header">
                  <span className="txn-id">{item.transaction_id.substring(0, 8)}...</span>
                  <span className="status-badge">{item.marked_status.toUpperCase()}</span>
                </div>
                <div className="item-details">
                  <span className="detail">
                    Original: <strong>{item.original_risk_level}</strong> ({item.original_recommendation})
                  </span>
                  <span className="detail">
                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
.feedback-summary {
  background: #0d1829;
  border: 1px solid #1e2d4a;
  border-radius: 8px;
  padding: 24px;
  color: #f0f4ff;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1e2d4a;
}

.summary-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.btn-refresh {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #00d4ff;
  color: #00d4ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: #00d4ff;
  color: #080c14;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
  transition: all 0.2s;
}

.summary-card:hover {
  border-color: rgba(0, 212, 255, 0.4);
  background: rgba(0, 212, 255, 0.08);
}

.summary-card.highlight {
  background: rgba(0, 201, 122, 0.05);
  border-color: rgba(0, 201, 122, 0.2);
}

.summary-card.success {
  background: rgba(0, 201, 122, 0.05);
  border-color: rgba(0, 201, 122, 0.2);
}

.summary-card.warning {
  background: rgba(232, 49, 42, 0.05);
  border-color: rgba(232, 49, 42, 0.2);
}

.summary-card.info {
  background: rgba(255, 122, 42, 0.05);
  border-color: rgba(255, 122, 42, 0.2);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 6px;
}

.card-icon .icon {
  width: 24px;
  height: 24px;
  color: #00d4ff;
}

.summary-card.success .card-icon {
  background: rgba(0, 201, 122, 0.1);
}

.summary-card.success .card-icon .icon {
  color: #00c97a;
}

.summary-card.warning .card-icon {
  background: rgba(232, 49, 42, 0.1);
}

.summary-card.warning .card-icon .icon {
  color: #e8312a;
}

.summary-card.info .card-icon {
  background: rgba(255, 122, 42, 0.1);
}

.summary-card.info .card-icon .icon {
  color: #ff7a2a;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 12px;
  color: #4a5a7a;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #f0f4ff;
}

.card-subtitle {
  font-size: 11px;
  color: #4a5a7a;
  margin-top: 4px;
}

.card-percentage {
  font-size: 12px;
  color: #00d4ff;
  font-weight: 600;
  margin-top: 4px;
}

.breakdown-section {
  margin-bottom: 24px;
}

.breakdown-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4a5a7a;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.breakdown-card {
  padding: 12px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
}

.breakdown-title {
  font-size: 12px;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.breakdown-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.breakdown-stats .stat {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.breakdown-stats .stat .label {
  color: #4a5a7a;
}

.breakdown-stats .stat .value {
  color: #f0f4ff;
  font-weight: 600;
}

.breakdown-stats .stat.correct .value {
  color: #00c97a;
}

.breakdown-stats .stat.incorrect .value {
  color: #e8312a;
}

.breakdown-stats .stat.escalate .value {
  color: #ff7a2a;
}

.recent-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #1e2d4a;
}

.recent-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4a5a7a;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  padding: 12px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
}

.recent-item.feedback-correct {
  background: rgba(0, 201, 122, 0.05);
  border-color: rgba(0, 201, 122, 0.2);
}

.recent-item.feedback-incorrect {
  background: rgba(232, 49, 42, 0.05);
  border-color: rgba(232, 49, 42, 0.2);
}

.recent-item.feedback-escalate {
  background: rgba(255, 122, 42, 0.05);
  border-color: rgba(255, 122, 42, 0.2);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.item-header .txn-id {
  color: #00d4ff;
  font-family: 'DM Mono', monospace;
  font-weight: 600;
}

.status-badge {
  padding: 2px 8px;
  background: rgba(0, 212, 255, 0.2);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.recent-item.feedback-correct .status-badge {
  background: rgba(0, 201, 122, 0.2);
  color: #00c97a;
}

.recent-item.feedback-incorrect .status-badge {
  background: rgba(232, 49, 42, 0.2);
  color: #e8312a;
}

.recent-item.feedback-escalate .status-badge {
  background: rgba(255, 122, 42, 0.2);
  color: #ff7a2a;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #4a5a7a;
}

.item-details .detail {
  font-size: 11px;
}

.item-details .detail strong {
  color: #f0f4ff;
}

.loading,
.empty {
  text-align: center;
  padding: 24px;
  color: #4a5a7a;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default FeedbackSummary;
