/**
 * ════════════════════════════════════════════════════════════════════════════════
 * WEBSOCKET HOOK FOR REAL-TIME ALERTS
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * React hook for managing WebSocket connection to fraud alert server.
 * Handles connection, reconnection, and message handling.
 * 
 * Usage:
 *   const { isConnected, alerts, error } = useWebSocket(clientId, apiKey);
 * 
 * ════════════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useCallback, useRef } from 'react';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 10;

export function useWebSocket(clientId, apiKey) {
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    messagesReceived: 0,
    lastMessageTime: null,
    connectionTime: null
  });

  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────
  // CONNECTION MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        console.log('✓ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setStats(prev => ({
          ...prev,
          connectionTime: new Date().toISOString()
        }));

        // Send authentication
        ws.send(JSON.stringify({
          type: 'auth',
          client_id: clientId,
          api_key: apiKey
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'fraud_alert') {
            // Add alert to list
            setAlerts(prev => [message.data, ...prev].slice(0, 100)); // Keep last 100
            setStats(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1,
              lastMessageTime: new Date().toISOString()
            }));

            // Trigger notification
            if (Notification.permission === 'granted') {
              new Notification('Fraud Alert', {
                body: `Risk Score: ${message.data.risk_score} - ${message.data.risk_level}`,
                icon: '/logo.svg',
                tag: message.data.transaction_id
              });
            }
          } else if (message.type === 'auth_success') {
            console.log('✓ Authentication successful');
          } else if (message.type === 'status') {
            console.log('Status:', message.data);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('✗ WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('✗ WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Attempt reconnection
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_INTERVAL);
        } else {
          setError('Failed to connect after multiple attempts');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError(err.message);
    }
  }, [clientId, apiKey]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Connect on mount
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }, []);

  return {
    isConnected,
    alerts,
    error,
    stats,
    clearAlerts,
    sendMessage,
    reconnect: connect
  };
}
